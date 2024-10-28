import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { getTime } from "@util/commands/time";
import { isGuildMember } from "@util/s";
import type { ChatInputCommandInteraction } from "discord.js";

export default class Time extends BaseCommand {
  constructor() {
    super({
      name: "time",
      commandType: "slash",
      description: "Глянуть время у хоста"
    });
  }

  async execute(
    interaction: ChatInputCommandInteraction,
    client: EmiliaClient,
  ) {
    if (!isGuildMember(interaction.member)) return;

    const timeMessage = getTime(interaction.member);

    return interaction.reply({ embeds: [timeMessage] });
  }
}
