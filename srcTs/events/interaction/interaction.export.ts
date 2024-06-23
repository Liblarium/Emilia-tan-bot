import { ButtonComponent } from "./components/button";
import { ModalComponent } from "./components/modal";
import { MenuComponent } from "./components/menu";
import type { EmiliaClient } from "../../client";
import type { Interaction } from "discord.js";
import { AddInDB } from "../../util/addInDB";
import { SlashCommand } from "./command";



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
