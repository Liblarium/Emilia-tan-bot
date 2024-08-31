import type { EmiliaClient } from "@client";
import type { ModalSubmitInteraction } from "discord.js";
//import { isComponents, isReply } from "@util/s";

class ModalComponent {
  constructor(interaction: ModalSubmitInteraction, client: EmiliaClient) {
    this.build(interaction, client);
  }

  /**
   * @param interaction
   * @param client
   */
  private build(interaction: ModalSubmitInteraction, client: EmiliaClient) {
    const isCustom = interaction.customId;
    /*const isMember = interaction.member;
    const isUser = interaction.user;
    const isGuild = interaction.guild;
    const isMessage = interaction.message;
    const isChannel = interaction.channel;*/
    client;
    isCustom;
  }
}

export { ModalComponent };
