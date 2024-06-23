import { ModalSubmitInteraction } from "discord.js";
import { EmiliaClient } from "../../../client";
import { isComponents, isReply } from "../../../utils";

class ModalComponent {
  constructor(interaction: ModalSubmitInteraction, client: EmiliaClient) {
    this.build(interaction, client);
  }

  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {EmiliaClient} client
   * @private
   */
  private async build(interaction: ModalSubmitInteraction, client: EmiliaClient) {
    const isCustom = interaction.customId;
    const isMember = interaction.member;
    const isUser = interaction.user;
    const isGuild = interaction.guild;
    const isMessage = interaction.message;
    const isChannel = interaction.channel;
  }
}

export { ModalComponent };
