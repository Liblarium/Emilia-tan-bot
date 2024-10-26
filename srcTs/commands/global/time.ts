import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { time } from "@util/s";
import type { Message } from "discord.js";

export default class Time extends BaseCommand {
  constructor() {
    super({
      name: "time",
      option: {
        aliases: ["время"],
        type: "command",
        delete: true,
      },
    });
  }

  async execute(
    message: Message,
    args: unknown[],
    commandName: string,
    client: EmiliaClient,
  ) {
    if (message.channel.isDMBased()) return;

    const color = message.member?.displayColor === 0 ? 0x48_df_bf : message.member?.displayColor;

    message.channel.send({ embeds: [{ title: "Время", description: `Сейчас у хоста: **${time()}**`, timestamp: new Date().toISOString(), color, footer: { text: "\u200b", icon_url: message.member?.displayAvatarURL({ forceStatic: false }) } }] });
  }
}
