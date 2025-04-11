import type { EmiliaClient } from "@client";
import { AbstractEvent } from "@constants/abstract/AbstractEvent";
import { CategoryEvents } from "@constants/enum/EventCategoryType";
import { SlashCommand } from "@handlers/SlashCommand";
import type { Interaction } from "discord.js";

export default class InteractionCreate extends AbstractEvent<CategoryEvents.BOT, "interactionCreate"> {
  constructor() {
    super({ name: "interactionCreate", category: CategoryEvents.BOT });
  }

  public execute(client: EmiliaClient, interaction: Interaction): void {
    if (interaction.isChatInputCommand()) new SlashCommand(interaction, client);
  }
}
