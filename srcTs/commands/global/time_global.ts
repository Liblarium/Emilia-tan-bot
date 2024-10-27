import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { getTime } from "@util/commands/time";
import { isGuildMember } from "@util/s";
import type { Message } from "discord.js";

export default class Time extends BaseCommand<"command"> {
  constructor() {
    super({
      name: "time",
      commandType: "command",
      option: {
        aliases: ["время"],
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
    if (message.channel.isDMBased() || !isGuildMember(message.member)) return;

    const timeMessage = getTime(message.member);

    return message.channel.send({ embeds: [timeMessage] });
  }
}
