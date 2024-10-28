import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { getRandomBall } from "@util/commands/bal";
import { displayColor, isGuildMember } from "@util/s";
import type { ChatInputCommandInteraction } from "discord.js";

export default class Bal_s extends BaseCommand {
  constructor() {
    super({
      name: "шар",
      description: "Задай вопрос боту - она ответит тебе",
      commandType: "slash",
    });

    this.data
      .addStringOption((option) =>
        option
          .setName("вопрос")
          .setDescription("Введи вопрос для получения ответа")
          .setMaxLength(4000)
          .setRequired(true),
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
    if (!isGuildMember(interaction.member)) return;

    const memberColor = interaction.member.displayColor;
    const color = displayColor(memberColor, "#48dfbf");
    const privates = interaction.options.getBoolean("приватность");
    const question = interaction.options.getString("вопрос", true);
    const bal = getRandomBall(
      interaction.guildId === "451103537527783455" ? 40 : 14,
    );

    await interaction.reply({
      embeds: [
        {
          title: "Вопрос:",
          description: `${question}`,
          color,
          fields: [
            {
              name: "Ответ:",
              value: `\u000A${bal}`,
            },
          ],
        },
      ],
      ephemeral: privates ?? false,
    });
  }
}
