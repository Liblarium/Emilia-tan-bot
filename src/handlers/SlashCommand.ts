import { EmiliaClient } from "@client";
import { emiliaError, Decorators } from "@utils";
import { ChatInputCommandInteraction } from "discord.js";

export class SlashCommand {
  constructor(interaction: ChatInputCommandInteraction, client: EmiliaClient) {
    this.execute(interaction, client);
  }

  /**
   * Executes a slash command based on the interaction and client provided.
   *
   * @param interaction - The interaction object representing the incoming slash command.
   * @param client - The EmiliaClient instance used to handle the command.
   * @returns A Promise that resolves to unknown. It may resolve to an interaction reply in some cases.
   * @throws Will throw an error if client is not initialized.
   *
   * This function checks if the interaction is a chat input command and retrieves the corresponding
   * slash command from the client's collection. If the command does not exist or is restricted to
   * developers, it will reply with an appropriate message. Otherwise, it executes the command.
   */
  @Decorators.logCaller()
  private async execute(interaction: ChatInputCommandInteraction, client: EmiliaClient): Promise<unknown> {
    if (!client) throw emiliaError("Client must be initialized!");
    if (!interaction.isChatInputCommand()) return;

    const slash_command = client.slashCommand.get(interaction.commandName);

    if (!slash_command) {
      return interaction.reply({ content: "Такой команды нет или она не попала в список команд.", ephemeral: true });
    }
    if (slash_command.option.developer && interaction.user.id !== "211144644891901952") {
      return interaction.reply({ content: "Эта команда доступна только разработчику бота.", ephemeral: true });
    }

    await slash_command.execute(interaction, client);
  }
}