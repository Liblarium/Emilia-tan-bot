import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { getOrEditPrefix } from "@util/commands/prefix";
import { isGuildMember } from "@util/s";
import type { Message } from "discord.js";

export default class Prefix extends BaseCommand {
  constructor() {
    super({
      name: "prefix",
      commandType: "command",
      option: {
        delete: true,
      },
    });
  }

  async execute(
    message: Message,
    args: string[],
    commandName: string,
    client: EmiliaClient,
  ): Promise<Message | void> {
    if (
      !message.guild ||
      !isGuildMember(message.member) ||
      message.member.user.bot ||
      message.webhookId != null ||
      message.channel.isDMBased()
    )
      return;

    const prefix = args[0];
    const prefixMessage = await getOrEditPrefix({
      guildId: message.guild.id,
      newPrefix: prefix,
      color: message.member.displayColor,
      isOwner: message.member.user.id === message.guild.ownerId,
    });

    return message.channel.send({ embeds: [prefixMessage] });
  }
}
