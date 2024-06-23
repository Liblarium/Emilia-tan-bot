import { ChatInputCommandInteraction } from "discord.js";
import { BaseCommand } from "../../base/command";
import { EmiliaClient } from "../../client";

export default class Test extends BaseCommand {
  constructor() {
    super({
      name: `тест`,
      description: `Тестовая команда`,
      option: {
        type: `slash`,
        developer: true,
      },
    });
  }

  async execute(interaction: ChatInputCommandInteraction, client: EmiliaClient) {
    // prettier-ignore
    await interaction.reply({
      content: `Тут ничего нет`,
      components: [{
        type: 1,
        components: [{
          type: 2,
          customId: `but_test`,
          style: 2,
          label: `test`,
        }],
      }],
      ephemeral: true,
    });
  }
}
