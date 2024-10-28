import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { editPol } from "@util/commands/pol";
import { isGuildMember, stringToBigInt } from "@util/s";
import type { ChatInputCommandInteraction } from "discord.js";

export default class Pol_s extends BaseCommand {
  constructor() {
    super({
      name: "pol",
      commandType: "slash",
      description: "Изменение пола в профиле/просмотр вашего пола в профиле",
    });

    this.data.addStringOption((option) =>
      option
        .setName("пол")
        .setDescription("Введите свой пол")
        .setMaxLength(50)
        .setRequired(true),
    );
  }

  async execute(
    interaction: ChatInputCommandInteraction,
    client: EmiliaClient,
  ) {
    if (!interaction.guild || !isGuildMember(interaction.member)) return;

    const userId = stringToBigInt(interaction.member.user.id);
    const newPol = interaction.options.getString("пол", true);
    const polMessage = await editPol({ id: userId, pol: newPol, color: interaction.member.displayColor });

    return await interaction.reply({ embeds: [polMessage], ephemeral: true });
  }
}
