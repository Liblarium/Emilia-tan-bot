import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { getPing } from "@util/commands/ping";
import { isGuildMember } from "@util/s";
import type { Message } from "discord.js";

export default class Ping extends BaseCommand {
  constructor() {
    super({
      name: "ping",
      commandType: "command",
      option: {
        delete: true,
      }
    });
  }

  execute(message: Message, args: unknown[], commandName: string, client: EmiliaClient) {
    if (message.channel.isDMBased() || !isGuildMember(message.member)) return;

    const pingMessage = getPing(client, message.member.displayColor);

    return message.channel.send({ embeds: [pingMessage] });
  }
}