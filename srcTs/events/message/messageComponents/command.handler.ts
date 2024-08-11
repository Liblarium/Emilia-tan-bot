import { ChannelType, type Message, PermissionsBitField } from "discord.js";
import type { EmiliaClient } from "../../../client";
import { Log } from "../../../log";
import { prefix } from "../../../utils";

const { Flags: { ManageMessages } } = PermissionsBitField;

export class CommandHandler {
  message: Message;
  client: EmiliaClient;

  constructor(message: Message, client: EmiliaClient) {
    this.message = message;
    this.client = client;
    this._build().catch((e: unknown) => { console.error(e); });
  }

  /**
   * @returns
   */
  private async _build(): Promise<undefined | Log> {
    const message = this.message;
    const client = this.client;

    if (message.author.bot || message.webhookId != null || message.channel.type === ChannelType.DM || !message.content.startsWith(prefix) || !client.user) return;

    const cliUser = client.user;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const argsShift = args.shift();

    if (!argsShift) return new Log({ text: "По неизвестным причинам argsShift == undefined", type: 2, categories: ["global", "event", "command"] });

    const commandName = argsShift.toLowerCase();

    if (!commandName) return new Log({ text: "Произошла ошибка. CommandName = undefined", type: 2, categories: ["global", "events"] });

    const command = client.commands.get(commandName);

    if (!command) return new Log({ text: `${message.member?.user?.username ?? "[Ошибка]"} попытался(ась) заюзать ${commandName || prefix} в ${message.guild?.name ?? "[Ошибка]"}`, type: 2, event: true, categories: ["global", "events"] });
    if (command.option.delete && message.channel.permissionsFor(cliUser.id)?.has(ManageMessages)) await message.delete();

    await command.execute(message, args, commandName, client);
  }
}
