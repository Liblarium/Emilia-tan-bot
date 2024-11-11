import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import type { GuildLogOption } from "@type";
import type { MessageOrPartialMessage } from "@type/event";
import { stringToBigInt } from "@type/util/utils";
import { modFilter } from "@util/logFilter";
import {
  EventActions,
  GuildLogsIntents,
  clipMessageLog,
  getGuildLogSettingFromDB,
  hexToDecimal,
  parseJsonValue
} from "@util/s";
import { type OmitPartialGroupDMChannel, TextChannel } from "discord.js";

export default class MessageDelete extends BaseEvent {
  constructor() {
    super({ name: "messageDelete", category: "bot" });
  }

  async execute(message: OmitPartialGroupDMChannel<MessageOrPartialMessage>, client: EmiliaClient) {
    if (!message.guild || modFilter.includes(message.channelId)) return;

    const dbGuild = await getGuildLogSettingFromDB(
      stringToBigInt(message.guild.id),
      { message: true },
      GuildLogsIntents.MESSAGE & EventActions.DELETE,
    );

    if (!dbGuild) return; //Мне не зачем включать логи, если они выключены или не были добавлены в интенты

    const logChannel = parseJsonValue<GuildLogOption>(dbGuild.message);

    if (!logChannel.delete || logChannel.delete.length <= 17) return; //более вероятно он просто не указан. id имеет длину не менее 18 символов

    const channel = message.guild.channels.cache.get(logChannel.delete);

    if (!(channel instanceof TextChannel)) return;

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
