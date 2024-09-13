import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { time } from "@util/s";
import { type ChatInputCommandInteraction, GuildMember } from "discord.js";

export default class Time extends BaseCommand {
  constructor() {
    super({
      name: "time",
      option: {
        type: "slash",
      },
      description: "Глянуть время у хоста"
    });
  }

  async execute(
    interaction: ChatInputCommandInteraction,
    client: EmiliaClient,
  ) {
    if (!(interaction.member instanceof GuildMember)) return;
    const color =
      interaction.member.displayColor === 0
        ? 0x48_df_bf
        : interaction.member?.displayColor;

    interaction.reply({
      embeds: [
        {
          title: "Время",
          description: `Сейчас у хоста: **${time()}**`,
          timestamp: new Date().toISOString(),
          color,
          footer: {
            text: "\u200b",
            icon_url: interaction.member.displayAvatarURL({ forceStatic: false }),
          },
        },
      ],
      ephemeral: true
    });
  }
}
