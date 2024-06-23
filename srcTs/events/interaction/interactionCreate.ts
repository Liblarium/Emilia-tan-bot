import { InteractionHandler } from "./interaction.export";
import type { EmiliaClient } from "../../client";
import type { Interaction } from "discord.js";
import { BaseEvent } from "../../base/event";



export default class InteractionCreate extends BaseEvent {
  constructor() {
    super({ name: `interactionCreate`, category: `bot` });
  }

  execute(interaction: Interaction, client: EmiliaClient) {
    new InteractionHandler(interaction, client);
  }
}
