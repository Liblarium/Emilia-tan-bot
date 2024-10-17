import type { EmiliaClient } from "@client";
import { Log } from "@log";
import type { ChatInputCommandInteraction } from "discord.js";

class SlashCommand {
  constructor(interaction: ChatInputCommandInteraction, client: EmiliaClient) {
    this.build(interaction, client).catch((e: unknown) => { console.error(e); });
  }

  private async build(interaction: ChatInputCommandInteraction, client: EmiliaClient) {
    try {
      const slash_command = client.slashCommands.get(interaction.commandName);

      if (!slash_command) {
        return interaction.reply({ content: "Такой команды нет.", ephemeral: true });
      }
      if (slash_command.option.developer && interaction.user.id !== "211144644891901952") {
        return interaction.reply({ content: "Эта команда доступна только разработчику бота.", ephemeral: true });
      }

      await slash_command.execute(interaction, client);
    } catch (e: unknown) {
      new Log({ text: (e as Error).message, type: 2, categories: ["global", "event"] });
    }
  }
}

export { SlashCommand };
