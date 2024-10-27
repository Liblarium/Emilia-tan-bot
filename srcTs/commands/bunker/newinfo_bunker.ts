import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { updateUserBio } from "@util/commands/newinfo";
import { isGuildMember } from "@util/s";
import type { ChatInputCommandInteraction } from "discord.js";

export default class NewInfo_s extends BaseCommand<"slash"> {
  constructor() {
    super({
      name: "newinfo",
      commandType: "slash",
      description: "Установить новую информацию о себе",
    });

    this.data
      .addStringOption((option) =>
        option
          .setName("обновление")
          .setDescription("Текст больше 1024 символов не принимается")
          .setMaxLength(1024)
          .setRequired(true)
      );
  }

  async execute(interaction: ChatInputCommandInteraction, client: EmiliaClient) {
    if (!isGuildMember(interaction.member)) return;

    const newBio = interaction.options.getString("обновление", true);

    const updateMessage = await updateUserBio({ userId: interaction.user.id, newBio });

    return await interaction.reply({
      embeds: [updateMessage], ephemeral: true
    });
  }
}
