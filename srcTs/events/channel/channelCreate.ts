import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import { EventActions, GuildLogsIntents, getGuildLogSettingFromDB, hexToDecimal } from "@util/s";
import type { NonThreadGuildBasedChannel } from "discord.js";

export default class ChannelCreate extends BaseEvent {
  constructor() {
    super({
      name: "channelCreate",
      category: "bot",
    });
  }

  async execute(channel: NonThreadGuildBasedChannel, client: EmiliaClient) {
    const chan = await getGuildLogSettingFromDB({
      guildId: channel.guild.id,
      select: { channel: true },
      intents: GuildLogsIntents.CHANNEL | EventActions.CREATE,
      messageType: "create",
      message: channel
    });

    if (!chan) return;

    chan.send({
      embeds: [
        {
          title: "Новый канал",
          color: hexToDecimal("#00ff00"),
          description: `${channel} (${channel.name} | ${channel.id})`,
          timestamp: new Date().toISOString(),
        },
      ],
    });

  }
}
