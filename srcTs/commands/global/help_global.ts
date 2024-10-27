import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { getHelpMessage } from "@util/commands/help.message";
import { isGuildMember } from "@util/s";
import type { Message } from "discord.js";

export default class Help extends BaseCommand {
  constructor() {
    super({
      name: "help",
      option: {
        type: "command",
        aliases: ["помощь", "command", "команды", "хелп", "commands"],
        delete: true,
      },
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
      !message.guildId ||
      message.channel.isDMBased()
    )
      return;

    const helpCommandName = args[0];
    const author = {
      name: message.member.displayName,
      icon_url: message.member.displayAvatarURL({ forceStatic: false }),
    };

    const helpMessage = await getHelpMessage({
      guildId: message.guildId,
      commandName: helpCommandName,
      author,
      memberColor: message.member.displayColor,
    });

    return message.channel.send({ embeds: [helpMessage] });
  }


}
