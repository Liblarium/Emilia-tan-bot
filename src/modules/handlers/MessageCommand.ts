import type { EmiliaClient } from "@client";
import { prefix } from "@core/config";
import { ErrorCode } from "@enum/errorCode";
import { LogFactory } from "@log/logFactory";
import type { GuildPrefix } from "@type";
import { parseJsonValue } from "@utils/transform/parseJsonValue";
import { stringToBigInt } from "@utils/transform/stringToBigInt";
import { type Message, PermissionsBitField } from "discord.js";

const { Flags: { ManageMessages } } = PermissionsBitField;

export class MessageCommand {
  constructor(message: Message, client: EmiliaClient) {
    this.execute(message, client).catch((e: unknown) => { console.error(e); });
  }

  /**
   * Executes a command based on the provided message and client.
   * 
   * @param message - The message object containing the command details.
   * @param client - The EmiliaClient instance handling the command.
   * @returns A Log object if an error occurs, otherwise undefined.
   * 
   * The function will:
   * - Return early if the message is from a DM, a bot, or a webhook,
   *   or if the client is not initialized.
   * - Retrieve the guild's prefix from the database or use the default prefix.
   * - Ignore messages that don't start with the prefix.
   * - Parse the command name and arguments from the message.
   * - Log and return if the command name is invalid or undefined.
   * - Check if the command exists and log an error if it doesn't.
   * - Delete the message if the command option requires it and permissions allow.
   * - Execute the command with the parsed arguments.
   */
  private async execute(message: Message, client: EmiliaClient): Promise<void> {
    if (message.channel.isDMBased() || !message.guildId || !client.user || message.author.bot || message.webhookId != null) return;

    const guildDB = await client.prisma.guild.findFirst({ where: { id: stringToBigInt(message.guildId) }, select: { prefix: true } });

    const pref = guildDB === null ? prefix : parseJsonValue<GuildPrefix>(guildDB.prefix).now;

    if (!message.content.startsWith(pref)) return;

    const cliUser = client.user;
    const args = message.content.slice(pref.length).trim().split(/ +/);
    const argsShift = args.shift();

    if (!argsShift) return await LogFactory.log({ text: "По неизвестным причинам argsShift == undefined", type: 2, categories: ["global", "event", "command"], tags: ["handler", "command"], code: ErrorCode.UNKNOWN_ERROR });

    const commandName = argsShift.toLowerCase();

    if (!commandName) return await LogFactory.log({ text: "Произошла ошибка. CommandName = undefined", type: 2, categories: ["global", "events"], tags: ["handler", "command"], code: ErrorCode.INVALID_DATA });

    const command = client.command.get(commandName);

    if (!command) return await LogFactory.log({ text: `${message.member?.user?.username ?? "[Ошибка]"} попытался(ась) заюзать ${commandName || pref} в ${message.guild?.name ?? "[Ошибка]"}`, type: 2, categories: ["global", "events"], tags: ["handler", "command"], code: ErrorCode.COMMAND_NOT_FOUND });

    if (command.option.delete && message.channel.permissionsFor(cliUser.id)?.has(ManageMessages)) await message.delete();

    await command.execute(message, args, commandName, client);
  }
}
