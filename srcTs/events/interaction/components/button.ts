import { ButtonInteraction } from "discord.js";
import { EmiliaClient } from "../../../client";
import { isComponents, isModal, isReply } from "../../../utils";

class ButtonComponent {
  constructor(interaction: ButtonInteraction, client: EmiliaClient) {
    this.build(interaction, client);
  }

  /**
   * @param {ButtonInteraction} interaction
   * @param {EmiliaClient} client
   * @private
   */
  private async build(interaction: ButtonInteraction, client: EmiliaClient) {
    const isCustom = interaction.customId;
    const isMember = interaction.member;
    const isUser = interaction.user;
    const isGuild = interaction.guild;
    const isMessage = interaction.message;
    const isChannel = interaction.channel;

    if (isCustom == `but_test`) {
      console.log(interaction.message.components);
      await interaction.reply({ content: `Тут ничего нет`, ephemeral: true });
    }
  }
}

export { ButtonComponent };
