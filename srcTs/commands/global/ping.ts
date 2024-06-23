import { BaseCommand } from "../../base/command";
import { EmiliaClient } from "../../client";
import { Message } from "discord.js";
import { Log } from "../../log";

export default class Ping extends BaseCommand {
  constructor() {
    super({
      name: `ping`,
      option: {
        type: `command`,
        delete: true,
      }
    });
  }

  async execute(message: Message, args: any[], commandName: string, client: EmiliaClient) {
    new Log({ text: `Пинг: ${client.ws.ping} ms`, type: 1, categories: [`global`, `command`] });
    message.channel.send({ embeds: [{ description: `Мой пинг: ${client.ws.ping} ms`, color: message.member?.displayColor == 0 ? 7_180_443 : message.member?.displayColor }] });
  }
}