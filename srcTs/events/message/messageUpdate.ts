import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import type { MessageOrPartialMessage } from "@type/event";
import { modFilter } from "@util/logFilter";
import {
  EventActions,
  GuildLogsIntents,
  clipMessageLog,
  getGuildLogSettingFromDB,
  hexToDecimal,
} from "@util/s";

export default class MessageUpdate extends BaseEvent {
  constructor() {
    super({ name: "messageUpdate", category: "bot" });
  }

  async execute(oldMessage: MessageOrPartialMessage, newMessage: MessageOrPartialMessage, client: EmiliaClient) {
    if (!oldMessage.guild || !newMessage.guild || [oldMessage.guildId, newMessage.guildId].includes("451103537527783455") && (modFilter.includes(oldMessage.channelId) || modFilter.includes(newMessage.channelId)) || oldMessage.content === newMessage.content) return;

    const channel = await getGuildLogSettingFromDB({
      guildId: newMessage.guild.id,
      select: { message: true },
      intents: GuildLogsIntents.MESSAGE | EventActions.UPDATE,
      messageType: "update",
      message: newMessage
    });

    if (!channel) return; //Мне не зачем включать логи, если они выключены или не были добавлены в интенты

    const color = hexToDecimal("#ffa600");
    const timestamp = new Date().toISOString();
    const fields = [
      {
        name: "Автор",
        value: `${newMessage.author}`,
        inline: true,
      },
      {
        name: "Канал",
        value: `${newMessage?.channel ?? "[Ошибка]"}`,
        inline: true,
      },
    ];

    if ((oldMessage.content?.length ?? 0) <= 1500 && (newMessage.content?.length ?? 0) <= 1500) return await channel.send({
      embeds: [
        {
          title: "Измененное сообщение",
          fields: [
            {
              name: "Старое сообщение",
              value: clipMessageLog(oldMessage, 1500),
            },
            {
              name: "Новое сообщение",
              value: clipMessageLog(newMessage, 1500),
            },
            ...fields
          ],
          color,
          timestamp,
        },
      ],
    });

    channel.send({
      embeds: [
        {
          title: "Старое сообщение",
          description: clipMessageLog(oldMessage, 4000),
          color: hexToDecimal("#ffa600"),
          timestamp,
        },
      ],
    });

    channel.send({
      embeds: [
        {
          title: "Измененное сообщение",
          description: clipMessageLog(newMessage, 4000),
          color: hexToDecimal("#ffa600"),
          fields,
          timestamp,
        },
      ],
    });
  }
}
