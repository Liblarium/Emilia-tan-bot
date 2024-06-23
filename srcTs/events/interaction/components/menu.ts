import { AnySelectMenuInteraction } from "discord.js";
import { EmiliaClient } from "../../../client";
import { isComponents, isModal, isReply } from "../../../utils";

class MenuComponent {
  constructor(interaction: AnySelectMenuInteraction, client: EmiliaClient) {
    this.build(interaction, client);
  }

  /**
   * @param {AnySelectMenuInteraction} interaction
   * @param {EmiliaClient} client
   * @private
   */
  private async build(interaction: AnySelectMenuInteraction, client: EmiliaClient) {
    const isCustom = interaction.customId;
    const isMember = interaction.member;
    const isUser = interaction.user;
    const isGuild = interaction.guild;
    const isMessage = interaction.message;
    const isChannel = interaction.channel;
    const isValue = interaction.values;
  }
}

export { MenuComponent };
