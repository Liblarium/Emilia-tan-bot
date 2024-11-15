import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { updateUserBio } from "@util/commands/newinfo";
import { isGuildMember } from "@util/s";
import type { Message } from "discord.js";

export default class NewInfo extends BaseCommand {
  constructor() {
    super({
      name: "newinfo",
      commandType: "command",
      aliases: ["nio"],
      option: {
        delete: true,
      },
      //description: "Изменение информации о себе",
    });
  }

  async execute(
    message: Message,
    args: string[],
    commandName: string,
    client: EmiliaClient,
  ) {
    if (
      !isGuildMember(message.member) ||
      message.channel.isDMBased()
    )
      return;

    const bio = args.join(" ");

    const updateMessage = await updateUserBio({ userId: message.author.id, newBio: bio });

    return message.channel.send({ embeds: [updateMessage] });
  }
}
