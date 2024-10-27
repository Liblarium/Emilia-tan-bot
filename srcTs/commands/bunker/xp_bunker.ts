import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { getXp } from "@util/commands/xp";
import { isGuildMember } from '@util/s';
import type { ChatInputCommandInteraction } from "discord.js";

export default class Xp extends BaseCommand<"slash"> {
  constructor() {
    super({
      name: "xp",
      commandType: "slash",
      description: "Показывает текущий опыт пользователя.",
    });

    this.data
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("Глянуть уровень пользователя")
          .setRequired(false)
      );
  }

  async execute(interaction: ChatInputCommandInteraction, client: EmiliaClient) {
    if (!isGuildMember(interaction.member) || !interaction.guild) return;

    const user = interaction.options.getUser("user", false);
    const member = interaction.guild.members.cache.get(user?.id || "0") || interaction.member;

    await getXp({ id: member.user.id, guildId: interaction.guild.id, color: member.displayColor, isYou: member.user.id === interaction.user.id }).then((message) => interaction.reply({ embeds: [message], ephemeral: true }));
  }
}
