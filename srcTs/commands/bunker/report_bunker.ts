import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { setReport } from "@util/commands/report";
import { hexToDecimal, isGuildMember } from "@util/s";
import {
  type ChatInputCommandInteraction,
  GuildMember,
  TextChannel,
  type VoiceChannel,
} from "discord.js";

export default class Report_s extends BaseCommand {
  constructor() {
    super({
      name: "report",
      commandType: "slash",
      description: "Пожаловаться на другого пользователя",
    });
    this.data
      .addUserOption((option) =>
        option
          .setName("пользователь")
          .setDescription("Выбор пользователя, на которого будет жалоба")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("жалоба")
          .setDescription(
            "Опишите причину жалобы. Больше 4к символов не принимаю.",
          )
          .setMaxLength(4000)
          .setRequired(true),
      );
  }

  async execute(
    interaction: ChatInputCommandInteraction,
    client: EmiliaClient,
  ) {
    if (!isGuildMember(interaction.member) || !interaction.guild) return;
    const users = interaction.options.getUser("пользователь", true);
    const string = interaction.options.getString("жалоба", true);
    const member = interaction.guild.members.cache.get(users.id);

    if (!member) return interaction.reply({
      embeds: [{
        title: "Жалоба на пользователя",
        description: "Указанный пользователь по неизвестным причинам - не был найден. Попробуйте ещё раз или сообщение об этом Мие",
        color: hexToDecimal("#ff2500")
      }]
    });

    await setReport<"interaction">({ mesInt: interaction, reporter: interaction.member, reported: member, report: string });
  }
}
