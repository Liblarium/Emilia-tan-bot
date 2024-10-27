import { displayColor, hexToDecimal } from "@util/s";
import {
  type APIEmbed,
  ChatInputCommandInteraction,
  type GuildMember,
  type InteractionResponse,
  type Message,
  TextChannel,
  type VoiceChannel,
} from "discord.js";

type ReportArgs<T extends "message" | "interaction"> = {
  mesInt: T extends "interaction" ? ChatInputCommandInteraction : T extends "message" ? Message : unknown;
  report: string;
  reporter: GuildMember;
  reported: GuildMember | undefined;
}

type ReportReturn = Message | InteractionResponse;

export function setReport<T extends "interaction">(args: ReportArgs<T>): Promise<ReportReturn> | void;
export function setReport<T extends "message">(args: ReportArgs<T>): Promise<ReportReturn> | void;
export function setReport<T extends "message" | "interaction">({
  mesInt,
  report,
  reporter,
  reported,
}: ReportArgs<T>): Promise<ReportReturn> | void {
  if (!mesInt.guild) return;

  const errColor = hexToDecimal("#ff2500");

  if (!reported || !report) {
    if (
      mesInt instanceof ChatInputCommandInteraction ||
      mesInt.channel.isDMBased()
    )
      return;

    if (!reported)
      return mesInt.channel.send({
        embeds: [
          {
            title: "Жалоба на пользователя",
            description: "❌ Вы не указали пользователя!",
            color: errColor,
          },
        ],
      });

    if (!report)
      return mesInt.channel.send({
        embeds: [
          {
            title: "Жалоба на пользователя",
            description: "❌ Вы не указали жалобу!",
            color: errColor,
          },
        ],
      });
  }

  if (report.length > 4000) {
    const mesErr: APIEmbed = {
      title: "Жалоба на пользователя",
      description: `Ваша жалоба имеет более 4к символов (${report.length})`,
      color: errColor,
      footer: {
        text: "Попробуйте сократить её до значения менее 4к символов",
      },
    };

    if (mesInt instanceof ChatInputCommandInteraction) return mesInt.reply({ embeds: [mesErr], ephemeral: true });

    if (mesInt.channel.isDMBased()) return;

    return mesInt.channel.send({ embeds: [mesErr] });
  }

  if (reported.user.id === reporter.user.id) {
    const embeds: APIEmbed[] = [
      {
        title: "Жалоба на пользователя",
        description: "❌ Вы не можете пожаловаться на самого себя!",
        color: errColor,
      },
    ];

    if (mesInt instanceof ChatInputCommandInteraction) {
      mesInt.reply({ embeds });
    } else {
      if (mesInt.channel.isDMBased()) return;
      return mesInt.channel.send({ embeds });
    }
  }

  const channel = mesInt.guild.channels.cache.get("931608832575172719");

  if (!channel) {
    const content = "❌ Не удалось найти канал для репортов!";

    if (mesInt instanceof ChatInputCommandInteraction) return mesInt.reply({ content, ephemeral: true });
    if (mesInt.channel.isDMBased()) return;

    return mesInt.channel.send({ content });
  }

  if (!(channel instanceof TextChannel)) return;

  channel.send({
    embeds: [
      {
        author: {
          name: `${reporter.user.tag}`,
          icon_url: reporter.displayAvatarURL({
            forceStatic: false,
          }),
        },
        title: "Жалоба на пользователя",
        description: `${report}`,
        fields: [
          {
            name: "Пожаловался:",
            value: `${reporter} (${reporter.user.tag})`,
            inline: true,
          },
          {
            name: "В канале:",
            value: `${mesInt.channel} (${(mesInt.channel as TextChannel | VoiceChannel).name})`,
            inline: true,
          },
          { name: "\u200b", value: "\u200b", inline: true },
          {
            name: "Жалоба на:",
            value: `${reported} (${reported.user.username} | ${reported.user.id})`,
            inline: true,
          },
          { name: "ID пользователя:", value: `${reported.id}`, inline: true },
        ],
        color: displayColor(errColor, "#25ff00"),
        footer: {
          text: `ID жалующегося: ${reporter.user.id}`,
          icon_url: mesInt.guild.iconURL({ forceStatic: false }) ?? undefined,
        },
        timestamp: new Date().toISOString(),
      },
    ],
  });

  return mesInt instanceof ChatInputCommandInteraction
    ? mesInt.reply({
      content: "Жалоба была успешно отправлена!",
      ephemeral: true,
    })
    : (() => {
      if (mesInt.channel.isDMBased()) return;

      mesInt.channel.send({ content: "Жалоба была успешно отправлена!" });
    })();
}
