import { db } from "@client";
import { Log } from "@log";
import type { ArrayNotEmpty } from "@type/index";
import type { LogOptions } from "@type/log";
import { logCaller } from "@util/decorators";
import { stringToBigInt } from "@util/s";
import {
  ChannelType,
  GuildMember,
  type Interaction,
  type Message,
} from "discord.js";

const logCategories: ArrayNotEmpty<string> = ["add_in_db", "utils", "global"];

type MesIntr = Message | Interaction;

/**
 * Logs a message with the specified options
 * @param {LogOptions} args - log options
 * @returns {undefined}
 */
const log = (args: LogOptions): undefined => {
  new Log(args);
};

/**
 * Checks if a given value is an instance of GuildMember
 * @param member - unknown value to check
 * @returns whether the value is an instance of GuildMember
 */
function isGuildMember(member: unknown): member is GuildMember {
  return member instanceof GuildMember;
}

/**
 * Find or create user in database
 * @param userId - user id in bigint
 * @param member - GuildMember
 * @returns { id: bigint; username: string; } | void
 */
export class AddInDB {
  constructor(message: MesIntr) {
    this.build(message).catch((e: unknown) => {
      console.error(e);
      new Log({ text: e, type: "error", categories: ["global", "util"] });
    });
  }

  /**
   * The main method of the class, which is responsible for adding a server to the database and updating the user's username
   * @param message - Message or Interaction
   * @returns Promise<undefined>
   * @throws TypeError if there is an error in the input data
   */
  @logCaller
  private async build(message: MesIntr): Promise<undefined> {
    if (
      message.channel?.type === ChannelType.DM ||
      !message.guildId ||
      !message.guild
    )
      return;

    const guildId = stringToBigInt(message.guildId);

    const dbguild = await db.guild.findFirst({
      where: { id: guildId },
      select: { id: true, addInBD: true, levelModule: true },
    });

    if (!dbguild) return; //пока без добавления гильдии отдельно

    const member = message.member;

    if (!dbguild.addInBD || (member?.user.bot ?? !member)) return;
    if (!isGuildMember(member)) {
      return log({
        text: "member не member!",
        type: "error",
        categories: logCategories,
      });
    }

    await this.updateUsernameOrCreateUser(member);
  }

  /**
   * Updates the username for a user in the database if the user exists and the username is different
   * @param member - GuildMember
   * @returns {Promise<void>}
   * @private
   */
  @logCaller
  private async updateUsernameOrCreateUser(member: GuildMember): Promise<void> {
    const userId = stringToBigInt(member.user.id);
    const user = await db.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, username: member.user.username },
      select: { username: true },
    });

    if (member.user.username === user.username) return;

    await db.user.update({
      where: { id: userId },
      data: { username: member.user.username },
    });

    new Log({
      text: `Было обновлено имя ${user.username} на ${member.user.username} в БД!`,
      type: "info",
      categories: logCategories,
    });
  }
}
