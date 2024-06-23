import { BaseCommand } from "../../base/command";
import { EmiliaClient } from "../../client";
import { Message } from "discord.js";
import { time } from "../../utils";

export default class Time extends BaseCommand {
  constructor() {
    super({
      name: `time`,
      option: {
        type: `command`,
        aliases: [`время`],
        delete: true
      }
    });
  }

  async execute(message: Message, args: any[], commandName: string, client: EmiliaClient) {
    if (!message.member) return;

    const color = message.member.displayColor == 0 ? parseInt(`48dfbf`, 16) : message.member.displayColor;
    message.channel.send({
      embeds: [{
        title: `Время`,
        description: `Сейчас у хоста: **${time()}**`,
        timestamp: new Date().toISOString(),
        color,
        footer: {
          text: `Часовой пояс хоста - UTC+2`,
          icon_url: message.member.displayAvatarURL({ forceStatic: false })
        }
      }]
    });
  }
}