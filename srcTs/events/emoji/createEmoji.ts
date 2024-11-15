import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import {
  EventActions,
  GuildLogsIntents,
  getGuildLogSettingFromDB,
  hexToDecimal,
} from "@util/s";
import type { GuildEmoji } from "discord.js";

export default class EmojiCreate extends BaseEvent {
  constructor() {
    super({
      name: "emojiCreate",
      category: "bot",
    });
  }

  async execute(emoji: GuildEmoji, client: EmiliaClient) {
    const channel = await getGuildLogSettingFromDB({
      guildId: emoji.guild.id,
      intents: GuildLogsIntents.EMOJI | EventActions.CREATE,
      select: { emoji: true },
      messageType: "create",
      message: emoji,
    });

    if (!channel) return;

    channel.send({
      embeds: [{
        title: "Создание Эмодзи",
        description: `Был добавлен ${emoji} (${emoji.name})`,
        color: hexToDecimal("#25ff00"),
        timestamp: new Date().toISOString(),
      }]
    });
  }
}
