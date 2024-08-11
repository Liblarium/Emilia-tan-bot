import type { Message } from "discord.js";
import { BaseCommand } from "../../base/command";
import type { EmiliaClient } from "../../client";
import { Log } from "../../log";

export default class Ping extends BaseCommand {
  constructor() {
    super({
      name: "ping",
      option: {
        type: "command",
        delete: true,
      }
    });
  }

  execute(message: Message, args: unknown[], commandName: string, client: EmiliaClient) {
    new Log({ text: `Пинг: ${client.ws.ping.toString()} ms`, type: 1, categories: ["global", "command"] });
    return message.channel.send({ embeds: [{ description: `Мой пинг: ${client.ws.ping.toString()} ms`, color: message.member?.displayColor === 0 ? 7_180_443 : message.member?.displayColor }] });
  }
}