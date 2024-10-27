import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { getPing } from "@util/commands/ping";
import { isGuildMember } from "@util/s";
import type { ChatInputCommandInteraction } from "discord.js";

export default class Ping_s extends BaseCommand<"slash"> {
  constructor() {
    super({
      name: "ping",
      commandType: "slash",
      description: "Пинг бота",
    });
  }

  async execute(
    interaction: ChatInputCommandInteraction,
    client: EmiliaClient,
  ) {
    if (!isGuildMember(interaction.member)) return;

    const pingMessage = getPing(client, interaction.member.displayColor);
    interaction.reply({
      embeds: [pingMessage],
      ephemeral: true,
    });
  }
}
