import { db } from "@database";
import { Log } from "@log";
import { dostup } from "@schema/dostup";
import { guild } from "@schema/guild";
import { globalLevel } from "@schema/level.global";
import { users } from "@schema/user";
import type { ArrayNotEmpty } from "@type/index";
import { EmiliaTypeError } from "@util/s";
import {
  ChannelType,
  GuildMember,
  type Interaction,
  type Message,
} from "discord.js";
import { eq } from "drizzle-orm";

const logCategories: ArrayNotEmpty<string> = ["add_in_db", "utils", "global"];

type MesIntr = Message | Interaction;

function isGuildMember(member: unknown): member is GuildMember {
  return member instanceof GuildMember;
}

export class AddInDB {
  constructor(message: MesIntr) {
    this.build(message).catch((e: unknown) => {
      console.error(e);
    });
  }

  private async build(message: MesIntr): Promise<undefined | Log> {
    if (
      message.channel?.type === ChannelType.DM ||
      !message.guildId ||
      !message.guild
    )
      return;

    const guildId = message.guildId;
    const guilddb = await db.query.guild.findFirst({
      where: eq(guild.id, BigInt(guildId)),
      columns: { id: true, addInBD: true },
    });
    let errrors = 0;

    if (guilddb === undefined) {
      errrors++;
      const addedInBD = ["334418584774246401", "451103537527783455"].includes(
        guildId,
      );
      console.log(message.guildId, addedInBD);
      const newGuild = await db
        .insert(guild)
        .values({ id: BigInt(guildId), addInBD: addedInBD })
        .returning({ insertedId: guild.id });

      if (newGuild.length < 1)
        return new Log({
          text: "По неизвестным причинам - новый сервер не было добавлен",
          type: "error",
          categories: logCategories,
        });

      new Log({
        text: `Был добавлен новый сервер (| ${message.guild.name} |)[${message.guildId}] в базу данных!`,
        type: "info",
        categories: logCategories,
      });

      if (errrors >= 5) throw new TypeError("Проверь входящие данные!");
      return this.build(message);
    }

    if (guilddb !== undefined) errrors = 0;

    const member = message.member;

    if (!guilddb.addInBD || (member?.user.bot ?? !member)) return;

    if (!isGuildMember(member)) {
      return new Log({
        text: "member не member!",
        type: "error",
        categories: logCategories,
      });
    }

    const userId = BigInt(member.user.id);
    async function findOneOrCreateUser() {
      const find = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
          id: true,
          username: true
        },
      });

      if (find !== undefined) return find;
      if (!isGuildMember(member)) throw new EmiliaTypeError(`Указанный пользователь ${member} - не является участником сервера!`);

      const manyCreated = await db.transaction(async (tx) => {
        const dostupRes = await tx
          .insert(dostup)
          .values({ id: userId })
          .returning({ insertedId: dostup.id });

        const globalLevelRes = await tx
          .insert(globalLevel)
          .values({ id: userId })
          .returning({ insertedId: globalLevel.id });

        const userRes = await tx
          .insert(users)
          .values({
            id: userId,
            username: member.user.username
          })
          .returning({ insertedId: users.username });


        return (
          userRes.length > 0 &&
          dostupRes.length > 0 &&
          globalLevelRes.length > 0
        );
      });
      if (manyCreated === true)
        new Log({
          text: `Был добавлен новый пользователь (${member.user.username}) в БД!`,
          type: "info",
          categories: logCategories,
        });

      return findOneOrCreateUser();
    };

    const user = await findOneOrCreateUser();

    if (member.user.username === user.username) return;

    await db
      .update(users)
      .set({ username: member.user.username })
      .where(eq(users.id, userId));

    new Log({
      text: `Было обновлено имя ${user.username} на ${member.user.username} в БД!`,
      type: "info",
      categories: logCategories,
    });
  }
}
