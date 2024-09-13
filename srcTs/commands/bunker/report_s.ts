import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
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
      option: {
        type: "slash",
      },
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
    const users = interaction.options.getUser("пользователь", true);
    const string = interaction.options.getString("жалоба", true);

    if (
      !interaction.member ||
      !(interaction.member instanceof GuildMember) ||
      !interaction.guild ||
      !client.user
    )
      return;

    if (string.length >= 4001)
      return interaction.reply({
        embeds: [
          {
            title: "Жалоба на пользователя",
            description: `Ваша жалоба имеет более 4к символов (${string.length})`,
            color: 0xff_25_00,
            footer: {
              text: "В следующий раз введите жалобу по меньше",
            },
          },
        ],
        ephemeral: true,
      });
    if (users.id === interaction.member.user.id)
      return interaction.reply({
        embeds: [
          {
            title: "Жалоба на пользователя",
            description: "Пожаловаться на самого себя низя. Бака",
            color: 0xff_25_00,
            footer: {
              text: "Хорошая попытка, но недостаточно хороша.",
              icon_url: interaction.guild.members.cache
                .get(client.user.id)
                ?.displayAvatarURL({ forceStatic: false }) as
                | string
                | undefined,
            },
          },
        ],
        ephemeral: true,
      });

    const color =
      interaction.member.displayColor === 0
        ? 0xff_25_00
        : interaction.member.displayColor;
    const channel = interaction.guild.channels.cache.get("931608832575172719");

    if (!(channel instanceof TextChannel))
      return await interaction.reply({
        content:
          "При отправке жалобы произошла ошибка. Попробуйте ещё раз или тыкайте Мию",
        ephemeral: true,
      });

    channel.send({
      embeds: [
        {
          author: {
            name: `${interaction.member.user.tag}`,
            icon_url: interaction.member.displayAvatarURL({
              forceStatic: false,
            }),
          },
          title: "Жалоба на пользователя",
          description: `${string}`,
          fields: [
            {
              name: "Пожаловался:",
              value: `${interaction.member} (${interaction.member.user.tag})`,
              inline: true,
            },
            {
              name: "В канале:",
              value: `${interaction.channel} (${(interaction.channel as TextChannel | VoiceChannel).name})`,
              inline: true,
            },
            { name: "\u200b", value: "\u200b", inline: true },
            {
              name: "Жалоба на:",
              value: `${users} (${users.username}#${users.discriminator})`,
              inline: true,
            },
            { name: "ID пользователя:", value: `${users.id}`, inline: true },
          ],
          color,
          footer: {
            text: `ID жалующегося: ${interaction.member.user.id}`,
            icon_url:
              interaction.guild.iconURL({ forceStatic: false }) ?? undefined,
          },
          timestamp: new Date().toISOString(),
        },
      ],
    });
    interaction.reply({
      embeds: [
        {
          title: "Жалоба на пользователя",
          description: "Ваша жалоба была успешно доставлена.",
          color: 0x25_ff_00,
        },
      ],
      ephemeral: true,
    });
  }
}
