import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import type { Interaction } from "discord.js";
import { InteractionHandler } from "./interaction.export";

export default class InteractionCreate extends BaseEvent {
  constructor() {
    super({ name: "interactionCreate", category: "bot" });
  }

  execute(interaction: Interaction, client: EmiliaClient) {
    new InteractionHandler(interaction, client);
  }
}
