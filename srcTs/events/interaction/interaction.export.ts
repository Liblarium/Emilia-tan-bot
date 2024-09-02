import type { EmiliaClient } from "@client";
import { AddInDB } from "@util/addInDB";
import type { Interaction } from "discord.js";
import { SlashCommand } from "./command";
import { ButtonComponent } from "./components/button";
import { MenuComponent } from "./components/menu";
import { ModalComponent } from "./components/modal";



class InteractionHandler {
  constructor(interaction: Interaction, client: EmiliaClient) {
    this.run(interaction, client);
  }

  run(interaction: Interaction, client: EmiliaClient) {
    new AddInDB(interaction);

    if (interaction.isChatInputCommand()) {
      new SlashCommand(interaction, client); //переписать позже
    }

    if (interaction.isButton()) {
      new ButtonComponent(interaction, client);
    }

    if (interaction.isStringSelectMenu()) {
      new MenuComponent(interaction, client);
    }

    if (interaction.isModalSubmit()) {
      new ModalComponent(interaction, client);
    }
  }
}

export { InteractionHandler };
