import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { sharMap } from "@util/ball.list";
import { random } from '@util/s';
import { type ChatInputCommandInteraction, GuildMember } from "discord.js";

export default class Bal_s extends BaseCommand {
  constructor() {
    super({
      name: "шар",
      option: {
        type: "slash",
      },
      description: "Задай вопрос боту - она ответит тебе"
    });

    this.data
      .addStringOption((option) =>
        option
          .setName("вопрос")
          .setDescription("Введи вопрос для получения ответа")
          .setMaxLength(4000)
          .setRequired(true)
      )
      .addBooleanOption((option) =>
        option
          .setName("приватность")
          .setDescription(
            "Будет ли виден ответ всем или только вам (можно не трогать)",
          )
          .setRequired(false),
      );
  }

  async execute(
    interaction: ChatInputCommandInteraction,
    client: EmiliaClient,
  ) {
    const color = interaction.member instanceof GuildMember ? interaction.member?.displayColor === 0 ? 0x48_df_bf : interaction.member.displayColor : 0x48_df_bf;
    const privates = interaction.options.getBoolean("приватность");
    const question = interaction.options.getString("вопрос", true);
    const bal = random(0, interaction.guildId === "451103537527783455" ? 40 : 14);

    await interaction.reply({
      embeds: [{
        title: "Вопрос:",
        description: `${question}`,
        color,
        fields: [{
          name: "Ответ:",
          value: `\u000A${sharMap[bal]}`,
        }]
      }],
      ephemeral: privates ?? false
    });
  }
}
