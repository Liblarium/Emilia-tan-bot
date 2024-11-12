import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import {
  EventActions,
  GuildLogsIntents,
  getGuildLogSettingFromDB,
  hexToDecimal,
} from "@util/s";
import type { GuildEmoji } from "discord.js";

export default class EmojiDelete extends BaseEvent {
  constructor() {
    super({
      name: "emojiDelete",
      category: "bot",
    });
  }

  async execute(emoji: GuildEmoji, client: EmiliaClient) {
    const channel = await getGuildLogSettingFromDB({
      guildId: emoji.guild.id,
      intents: GuildLogsIntents.EMOJI | EventActions.DELETE,
      select: { emoji: true },
      messageType: "delete",
      message: emoji,
    });

    if (!channel) return;

    channel.send({
      embeds: [{
        title: "Удаление Эмодзи",
        description: `Был удалён ${emoji} (${emoji.name})`,
        color: hexToDecimal("#ff2500"),
        timestamp: new Date().toISOString(),
      }]
    });
  }
}
