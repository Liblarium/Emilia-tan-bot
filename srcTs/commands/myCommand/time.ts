import type { Message } from "discord.js";
import { BaseCommand } from "../../base/command";
import { time } from "../../utils";

export default class Time extends BaseCommand {
  constructor() {
    super({
      name: "time",
      option: {
        type: "command",
        aliases: ["время"],
        delete: true
      }
    });
  }

  execute(message: Message/*, args: string[], commandName: string, client: EmiliaClient*/): undefined {
    if (!message.member) return;

    const color = message.member.displayColor === 0 ? 0x48_df_bf : message.member.displayColor;
    message.channel.send({
      embeds: [{
        title: "Время",
        description: `Сейчас у хоста: **${time()}**`,
        timestamp: new Date().toISOString(),
        color,
        footer: {
          text: "Часовой пояс хоста - UTC+2",
          icon_url: message.member.displayAvatarURL({ forceStatic: false })
        }
      }]
    }).catch((e: unknown) => { console.error(e); });
  }
}