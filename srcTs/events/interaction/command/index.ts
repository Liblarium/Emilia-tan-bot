import type { ChatInputCommandInteraction } from "discord.js";
import type { EmiliaClient } from "../../../client";
import { Log } from "../../../log";

class SlashCommand {
  constructor(interaction: ChatInputCommandInteraction, client: EmiliaClient) {
    this.build(interaction, client);
  }

  private async build(interaction: ChatInputCommandInteraction, client: EmiliaClient) {
    try {
      const slas_command = client.slashCommands.get(interaction.commandName);

      if (!slas_command) {
        return interaction.reply({ content: `Такой команды нет.`, ephemeral: true });
      }
      if (slas_command.option.developer && interaction.user.id !== `211144644891901952`) {
        return interaction.reply({ content: `Эта команда доступна только разработчику бота.`, ephemeral: true });
      }

      await slas_command.execute(interaction, client);
    } catch (e) {
      new Log({ text: e, type: 2, categories: [`global`, `event`] });
    }
  }
}

export { SlashCommand };
