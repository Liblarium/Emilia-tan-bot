import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import {
  EventActions,
  GuildLogsIntents,
  getGuildLogSettingFromDB,
  hexToDecimal,
} from "@util/s";
import type { GuildEmoji } from "discord.js";

export default class EmojiUpdate extends BaseEvent {
  constructor() {
    super({
      name: "emojiUpdate",
      category: "bot",
    });
  }

  async execute(oldEmoji: GuildEmoji, newEmoji: GuildEmoji, client: EmiliaClient) {
    if (oldEmoji.name === newEmoji.name) return;

    const channel = await getGuildLogSettingFromDB({
      guildId: newEmoji.guild.id,
      intents: GuildLogsIntents.EMOJI | EventActions.UPDATE,
      select: { emoji: true },
      messageType: "update",
      message: newEmoji,
    });

    if (!channel) return;

    channel.send({
      embeds: [{
        title: "Изменение Эмодзи",
        description: `Было обновлено название эмодзи ${newEmoji}: \n${oldEmoji.name} -> ${newEmoji.name}`,
        color: hexToDecimal("#ffa600"),
        timestamp: new Date().toISOString(),
      }]
    });
  }
}
