import type { EmiliaClient } from "@client";
import { Abstract } from "@constants";
import { SlashCommand } from "@handlers/SlashCommand";
import type { Interaction } from "discord.js";

export default class InteractionCreate extends Abstract.AbstractEvent<[Interaction, EmiliaClient], void> {
  constructor() {
    super({ name: "interactionCreate" });
  }

  public execute(interaction: Interaction, client: EmiliaClient): void {
    if (interaction.isChatInputCommand()) new SlashCommand(interaction, client);
  }
}
