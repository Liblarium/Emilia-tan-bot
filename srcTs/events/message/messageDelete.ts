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
import type { OmitPartialGroupDMChannel } from "discord.js";

export default class MessageDelete extends BaseEvent {
  constructor() {
    super({ name: "messageDelete", category: "bot" });
  }

  async execute(
    message: OmitPartialGroupDMChannel<MessageOrPartialMessage>,
    client: EmiliaClient,
  ) {
    if (!message.guild || modFilter.includes(message.channelId)) return;

    const channel = await getGuildLogSettingFromDB({
      guildId: message.guild.id,
      select: { message: true },
      intents: GuildLogsIntents.MESSAGE | EventActions.DELETE,
      messageType: "delete",
      message,
    });

    if (!channel) return;

    await channel.send({
      embeds: [
        {
          title: "Удаленное сообщение",
          description: clipMessageLog(message),
          fields: [
            {
              name: "Автор",
              value: `${message.author}`,
              inline: true,
            },
            {
              name: "Канал",
              value: `${message?.channel ?? "[Ошибка]"}`,
              inline: true,
            },
          ],
          color: hexToDecimal("#ff2500"),
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }
}
