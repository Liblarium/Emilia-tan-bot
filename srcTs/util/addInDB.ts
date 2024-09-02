import { database as db } from "@client";
import { Log } from "@log";
import { dostup } from "@schema/dostup";
import { guild } from "@schema/guild";
import { globalLevel } from "@schema/level.global";
import { users } from "@schema/user";
import type { ArrayNotEmpty } from "@type/index";
import { ChannelType, GuildMember, type Interaction, type Message } from "discord.js";
import { eq } from "drizzle-orm";


const logCategories: ArrayNotEmpty<string> = ["add_in_db", "utils", "global"];

type MesIntr = Message | Interaction;

export class AddInDB {
  constructor(message: MesIntr) {
    this.build(message).catch((e: unknown) => { console.error(e); });
  }

  private async build(message: MesIntr): Promise<undefined | Log> {
    if (message.channel?.type === ChannelType.DM || !message.guildId || !message.guild) return;

    const guildId = message.guildId;
    const guilddb = await db.query.guild.findFirst({ where: eq(guild.id, BigInt(guildId)), columns: { id: true, addInBD: true } });
    //.findOneBy("guilds", { id: guildId });
    let errrors = 0;

    if (guilddb === undefined) {
      errrors++;
      const addedInBD = ["334418584774246401", "451103537527783455"].includes(guildId);
      const newGuild = await db.insert(guild).values({ id: BigInt(guildId), addInBD: addedInBD }).returning({ insertedId: guild.id });

      if (newGuild.length < 1) return new Log({ text: "По неизвестным причинам - новый сервер не было добавлен", type: "error", categories: logCategories });

      new Log({ text: `Был добавлен новый сервер (| ${message.guild.name} |)[${message.guildId}] в базу данных!`, type: "info", categories: logCategories });

      if (errrors >= 5) throw new TypeError("Проверь входящие данные!");
      return this.build(message);
    }
    if (guilddb !== undefined) errrors = 0;

    const member = message.member;

    if (!guilddb.addInBD || (member?.user.bot ?? !member)) return;

    if (!(member instanceof GuildMember)) return new Log({ text: "member не member!", type: "error", categories: logCategories });

    const findOneOrCreateUser = async () => {
      const find = await db.query.users.findFirst({
        where: eq(user.id, member.user.id), columns: {
          id: true
        }
      });

      if (find === undefined) {
        const userId = BigInt(member.user.id);
        const manyCreated = await db.transaction(async (tx) => {
          const userRes = await tx.insert(user).values({ id: BigInt(userId), username: member.user.username, dostup: userId, globalLevel: userId }).returning({ insertedId: user.id });
        });
        //create dostup & globalLevel
      }
    };

    const user = db.findOneOrCreate({
      name: "users", filter: { id: member.user.id }, document: {
        id: member.user.id,
        info: { username: member.user.username },
      }
    });

    if (user.error) return new Log({ text: user.error, type: "error", categories: logCategories });
    if (user.created) return new Log({ text: `${member.user.username} был записан в БД!`, type: "info", categories: logCategories });

    const resUser = user.res;

    if (!(resUser != null && !user.created)) return;
    if (!resUser.info) return new Log({ text: "users.info = undefined", type: "error", categories: logCategories });
    if (member.user.username === resUser.info.username) return;

    const updUsername = db.update("users", { id: member.user.id }, { info: { username: member.user.username } });

    if (updUsername.error) return new Log({ text: updUsername.error, type: "error", categories: logCategories });

    new Log({ text: `Было обновлено имя ${resUser.info.username} на ${member.user.username} в БД!`, type: "info", categories: logCategories });
  }
}
