import type { EmiliaClient } from "@client";
import { db } from "@client";
import { Log } from "@log";
import type { GuildPrefix } from "@type/command";
import { parseJsonValue, prefix, stringToBigInt } from "@util/s";
import { type Message, PermissionsBitField } from "discord.js";

const { Flags: { ManageMessages } } = PermissionsBitField;

export class CommandHandler {
  message: Message;
  client: EmiliaClient;

  constructor(message: Message, client: EmiliaClient) {
    this.message = message;
    this.client = client;
    this._build().catch((e: unknown) => { console.error(e); });
  }

  private async _build(): Promise<undefined | Log> {
    const message = this.message;
    const client = this.client;

    if (message.channel.isDMBased() || !message.guildId) return;

    const guildDB = await db.guild.findFirst({ where: { id: stringToBigInt(message.guildId) }, select: { prefix: true } });

    const pref = guildDB === null ? prefix : parseJsonValue<GuildPrefix>(guildDB.prefix).now;

    if (message.author.bot || message.webhookId != null || !message.content.startsWith(pref) || !client.user) return;

    const cliUser = client.user;
    const args = message.content.slice(pref.length).trim().split(/ +/);
    const argsShift = args.shift();

    if (!argsShift) return new Log({ text: "По неизвестным причинам argsShift == undefined", type: 2, categories: ["global", "event", "command"] });

    const commandName = argsShift.toLowerCase();

    if (!commandName) return new Log({ text: "Произошла ошибка. CommandName = undefined", type: 2, categories: ["global", "events"] });

    const command = client.commands.get(commandName);

    if (!command) return new Log({ text: `${message.member?.user?.username ?? "[Ошибка]"} попытался(ась) заюзать ${commandName || pref} в ${message.guild?.name ?? "[Ошибка]"}`, type: 2, event: true, categories: ["global", "events"] });

    if (command.option.delete && message.channel.permissionsFor(cliUser.id)?.has(ManageMessages)) await message.delete();

    await command.execute(message, args, commandName, client);
  }
}
