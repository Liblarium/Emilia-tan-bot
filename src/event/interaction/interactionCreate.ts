import { EmiliaClient } from "@client";
import { Abstract } from "@constants";
import { Interaction } from "discord.js";
import { SlashCommand } from "@handlers/SlashCommand";

export default class InteractionCreate extends Abstract.AbstractEvent {
  constructor() {
    super({ name: "interactionCreate" });
  }

  public execute(interaction: Interaction, client: EmiliaClient): void {
    if (interaction.isChatInputCommand()) new SlashCommand(interaction, client);
  }
}