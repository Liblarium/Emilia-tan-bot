import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { getHelpMessage } from "@util/commands/help.message";
import { isGuildMember } from "@util/s";
import type { ChatInputCommandInteraction } from "discord.js";

export default class Help_s extends BaseCommand<"slash"> {
  constructor() {
    super({
      name: "help",
      commandType: "slash",
      description: "Посмотреть список команд",
    });

    this.data
      .addStringOption((option) =>
        option
          .setName("команда")
          .setDescription("Глянуть на описание команды")
          .setRequired(false),
      )
      .addBooleanOption((option) =>
        option
          .setName("приватность")
          .setDescription(
            "Будет ли виден описание команды всем или только вам (можно не трогать)",
          )
          .setRequired(false));
  }

  async execute(
    interaction: ChatInputCommandInteraction,
    client: EmiliaClient,
  ) {
    if (!interaction.guildId || !isGuildMember(interaction.member)) return;

    const author = {
      name: interaction.member.displayName,
      icon_url: interaction.member.displayAvatarURL({ forceStatic: false }),
    };
    const whyCommand = interaction.options.getString("команда");
    const privates = interaction.options.getBoolean("приватность") ?? false;

    const helpMessage = await getHelpMessage({
      guildId: interaction.guildId,
      commandName: whyCommand,
      author,
      memberColor: interaction.member.displayColor,
    });

    return await interaction.reply({ embeds: [helpMessage], ephemeral: privates });
  }
}
