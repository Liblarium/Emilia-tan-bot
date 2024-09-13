import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { Log } from "@log";
import { type ChatInputCommandInteraction, GuildMember } from "discord.js";

export default class Ping_s extends BaseCommand {
  constructor() {
    super({
      name: "ping",
      option: {
        type: "slash",
      },
      description: "Пинг бота",
    });
  }

  async execute(
    interaction: ChatInputCommandInteraction,
    client: EmiliaClient,
  ) {
    const color = interaction.member instanceof GuildMember ? interaction.member.displayColor : 0x6D_90_9B;

    new Log({ text: `Мой пинг: ${client.ws.ping} ms.`, type: "info", categories: ["global"] });
    interaction.reply({
      embeds: [
        {
          description: `Мой пинг: ${client.ws.ping} ms.`,
          color
        },
      ],
      ephemeral: true,
    });
  }
}
