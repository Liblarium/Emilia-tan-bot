import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import type { ChatInputCommandInteraction } from "discord.js";

export default class Test extends BaseCommand {
  constructor() {
    super({
      name: "тест",
      commandType: "slash",
      description: "Тестовая команда",
      option: {
        developer: true,
      },
    });
  }

  async execute(interaction: ChatInputCommandInteraction, client: EmiliaClient): Promise<undefined> {
    await interaction.reply({
      content: "Тут ничего нет",
      components: [{
        type: 1,
        components: [{
          type: 2,
          customId: "but_test",
          style: 2,
          label: "test",
        }],
      }],
      ephemeral: true,
    });
  }
}
