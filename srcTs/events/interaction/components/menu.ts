import type { AnySelectMenuInteraction } from "discord.js";
import type { EmiliaClient } from "../../../client";
//import { isComponents, isModal, isReply } from "../../../utils";

class MenuComponent {
  constructor(interaction: AnySelectMenuInteraction, client: EmiliaClient) {
    this.build(interaction, client);//.catch((e: unknown) => { console.error(e); });
  }

  /**
   * @param interaction
   * @param client
   */
  private build(interaction: AnySelectMenuInteraction, client: EmiliaClient) {
    const isCustom = interaction.customId;
    /*const isMember = interaction.member;
    const isUser = interaction.user;
    const isGuild = interaction.guild;
    const isMessage = interaction.message;
    const isChannel = interaction.channel;
    const isValue = interaction.values;*/
    client;
    isCustom;
  }
}

export { MenuComponent };
