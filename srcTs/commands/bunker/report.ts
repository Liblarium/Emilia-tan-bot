import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { type APIEmbedFooter, type Message, TextChannel } from "discord.js";

type SendOptions = { description: string; footer?: APIEmbedFooter, color: number };

export default class Report extends BaseCommand {
  constructor() {
    super({
      name: "report",
      option: {
        aliases: ["репорт"],
        type: "command",
        delete: true,
      },
      description: "Пожаловаться на другого пользователя",
    });
  }

  async execute(
    message: Message,
    args: string[],
    commandName: string,
    client: EmiliaClient,
  ) {
    if (message.guildId !== "451103537527783455" || !message.guild || !message.member || !client.user) return; //пока будет только для бункера. Мб позже сменю

    const reportUser = message.mentions.members?.first() || message.guild.members.cache.get(args[0]);
    const reportReason = args.slice(1).join(" ");

    const send = async ({ color, description, footer }: SendOptions): Promise<Message<boolean>> => {
      return await message.channel.send({
        embeds: [{
          title: "Жалоба на пользователя",
          description,
          color,
          footer
        }]
      });
    };

    if (!reportUser) return await send({ description: "Вы не упомянули (или не указали id) пользователя!", footer: { text: "Если вы ввели id - проверьте его правильность" }, color: 0xff_25_00 });

    if (reportReason.length < 1) return await send({ description: "Вы не написали причину репорта!", color: 0xff_25_00, footer: { text: "Причина репорта - обязательна)" } });

    if (reportUser.id === message.author.id) return await send({ description: "Вы не можете пожаловаться на себя)", footer: { text: "Хорошая попытка, но это не работает)", icon_url: message.guild.members.cache.get(client.user.id)?.displayAvatarURL({ forceStatic: false }) }, color: 0xff_25_00 });

    if (reportReason.length >= 4001) return await send({ description: "Я не знаю как ты это вызвал при 4к лимите, но давай меньше ;D", footer: { text: "Лимит от дискорда - 4к символа при нитро", icon_url: message.guild.members.cache.get(client.user.id)?.displayAvatarURL({ forceStatic: false }) }, color: 0xff_25_00 });

    const color =
      message.member.displayColor === 0
        ? 0xff_25_00
        : message.member.displayColor;


    const channel = message.guild.channels.cache.get("931608832575172719");
    if (!channel || !(channel instanceof TextChannel)) return message.channel.send({ content: "При отправлении жалобы - прошла ошибка. Попробуйте ещё раз или тыкай Мию" });
    await send({
      description: "Жалоба была доставлена!",
      color: 0x25_ff_00
    });
    await channel.send({
      embeds: [
        {
          title: "Жалоба на пользователя",
          description: args.slice(1).join(" "),
          color,
          fields: [
            {
              name: "Пожаловался:",
              value: `${message.member} (${message.member.user.tag})`,
              inline: true,
            },
            {
              name: "В канале:",
              value: `${message.channel} (${(message.channel as TextChannel).name})`,
              inline: true,
            },
            { name: "\u200b", value: "\u200b", inline: true },
            {
              name: "Жалоба на:",
              value: `${reportUser} (${reportUser.user.username})`,
              inline: true,
            },
            {
              name: "ID пользователя:",
              value: `${reportUser.user.id}`,
              inline: true,
            },
          ],
          footer: {
            text: `ID жалующегося: ${message.member.user.id}`,
            icon_url: message.guild.iconURL({ forceStatic: false }) as string | undefined,
          },
          timestamp: new Date().toISOString()
        }
      ]
    });
  }
}
