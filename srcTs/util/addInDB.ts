import { db } from "@database";
import { Log } from "@log";
import { dostup } from "@schema/dostup";
import { guild } from "@schema/guild";
import { globalLevel } from "@schema/level.global";
import { users } from "@schema/user";
import type { ArrayNotEmpty } from "@type/index";
import type { LogOptions } from "@type/log";
import { EmiliaTypeError } from "@util/s";
import {
  ChannelType,
  GuildMember,
  type Interaction,
  type Message,
} from "discord.js";
import { eq } from "drizzle-orm";

const logCategories: ArrayNotEmpty<string> = ["add_in_db", "utils", "global"];
let errors = 0;

type MesIntr = Message | Interaction;

/**
 * Logs a message with the specified options
 * @param {LogOptions} args - log options
 * @returns {undefined}
 */
const log = (args: LogOptions): undefined => { new Log(args); };

/**
 * Checks if a given value is an instance of GuildMember
 * @param member - unknown value to check
 * @returns whether the value is an instance of GuildMember
 */
function isGuildMember(member: unknown): member is GuildMember {
  return member instanceof GuildMember;
}

// TODO: Переписать код

/**
   * Find or create user in database
   * @param userId - user id in bigint
   * @param member - GuildMember
   * @returns { id: bigint; username: string; } | void
   */
export class AddInDB {
  private dbguild: { id: bigint; addInBD: boolean | null; } | undefined;
  constructor(message: MesIntr) {
    this.build(message).catch((e: unknown) => {
      new Log({ text: e, type: "error", categories: ["global", "util"] });
    });
  }

  /**
   * The main method of the class, which is responsible for adding a server to the database and updating the user's username
   * @param message - Message or Interaction
   * @returns Promise<undefined>
   * @throws TypeError if there is an error in the input data
   */
  private async build(message: MesIntr): Promise<undefined> {
    if (
      message.channel?.type === ChannelType.DM ||
      !message.guildId ||
      !message.guild
    )
      return;

    let dbguild = this.dbguild = await this.getGuild(BigInt(message.guildId));

    if (!dbguild) dbguild = await this.findOneOrCreateGuild(BigInt(message.guildId), message);

    const guildDB = dbguild;

    if (typeof guildDB === "object") errors = 0;
    if (!guildDB || guildDB instanceof Log) return;

    const member = message.member;

    if (!guildDB.addInBD || (member?.user.bot ?? !member)) return;
    if (!isGuildMember(member)) {
      return log({
        text: "member не member!",
        type: "error",
        categories: logCategories,
      });
    }
    await this.updateUsernameOrCreateUser(member);
  }

  private async findOneOrCreateUser(userId: bigint, member: GuildMember): Promise<{ id: bigint; username: string; } | void> {
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
        .onConflictDoNothing()
        .returning({ insertedId: dostup.id });

      const globalLevelRes = await tx
        .insert(globalLevel)
        .values({ id: userId })
        .onConflictDoNothing()
        .returning({ insertedId: globalLevel.id });

      const userRes = await tx
        .insert(users)
        .values({
          id: userId,
          username: member.user.username
        })
        .onConflictDoNothing()
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

    return this.findOneOrCreateUser(userId, member);
  }

  private async getGuild(guildId: bigint): Promise<{ id: bigint; addInBD: boolean | null; } | undefined> {
    const find = await db.query.guild.findFirst({
      where: eq(guild.id, guildId),
      columns: { id: true, addInBD: true },
    });
    return find;
  }

  /**
   * Find or create guild in database
   * @param guildId - guild id in bigint
   * @returns {{ id: bigint; addInBD: boolean; } | undefined | Log}
   */
  private async findOneOrCreateGuild(guildId: bigint, message: MesIntr): Promise<{ id: bigint; addInBD: boolean; } | undefined> {
    const guildDB = await this.getGuild(guildId);

    if (guildDB !== undefined) {
      this.dbguild = guildDB;

      return this.build(message);
    }

    errors++;
    const addedInBD = ["334418584774246401", "451103537527783455"].includes(guildId.toString());
    const newGuild = await db
      .insert(guild)
      .values({ id: BigInt(guildId), addInBD: addedInBD })
      .returning({ insertedId: guild.id });

    if (newGuild.length < 1)
      return log({
        text: "По неизвестным причинам - новый сервер не было добавлен",
        type: "error",
        categories: logCategories,
      });

    new Log({
      text: `Был добавлен новый сервер (| ${message.guild?.name} |)[${message.guildId}] в базу данных!`,
      type: "info",
      categories: logCategories,
    });

    if (errors >= 5) throw new EmiliaTypeError("Проверь входящие данные!");

    return await this.findOneOrCreateGuild(guildId, message);
  }

  /**
   * Updates the username for a user in the database if the user exists and the username is different
   * @param member - GuildMember
   * @returns {Promise<void>}
   * @private
   */
  private async updateUsernameOrCreateUser(member: GuildMember): Promise<void> {
    const userId = BigInt(member.user.id);

    const user = await this.findOneOrCreateUser(userId, member);

    if (!user || member.user.username === user.username) return;

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
