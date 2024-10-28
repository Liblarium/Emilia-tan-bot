import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { getOrEditPrefix } from "@util/commands/prefix";
import { isGuildMember } from "@util/s";
import type { ChatInputCommandInteraction } from "discord.js";

export default class Prefix_s extends BaseCommand {
  constructor() {
    super({
      name: "prefix",
      commandType: "slash",
      description: "Просмотр префикса бота",
    });

    this.data.addStringOption((option) =>
      option
        .setName("prefix")
        .setDescription("Новый префикс. Только для овнеров")
        .setRequired(false),
    );
  }

  async execute(
    interaction: ChatInputCommandInteraction,
    client: EmiliaClient,
  ) {
    if (!interaction.guild || !isGuildMember(interaction.member)) return;

    const newPrefix = interaction.options.getString("prefix");
    const prefixMessage = await getOrEditPrefix({
      guildId: interaction.guild.id,
      newPrefix,
      color: interaction.member.displayColor,
      isOwner: interaction.member.user.id === interaction.guild.ownerId,
    });

    return await interaction.reply({ embeds: [prefixMessage], ephemeral: true });
  }
}
