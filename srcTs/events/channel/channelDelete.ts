import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import { EventActions, GuildLogsIntents, getGuildLogSettingFromDB, hexToDecimal } from "@util/s";
import type { DMChannel, NonThreadGuildBasedChannel } from "discord.js";

export default class ChannelDelete extends BaseEvent {
  constructor() {
    super({
      name: "channelDelete",
      category: "bot",
    });
  }

  async execute(channel: DMChannel | NonThreadGuildBasedChannel, client: EmiliaClient) {
    if (channel.isDMBased()) return;

    const chan = await getGuildLogSettingFromDB({
      guildId: channel.guild.id,
      select: { channel: true },
      intents: GuildLogsIntents.CHANNEL | EventActions.DELETE,
      messageType: "delete",
      message: channel
    });

    if (!chan) return;

    chan.send({
      embeds: [
        {
          title: "Удален канал",
          color: hexToDecimal("#ff2500"),
          description: `${channel.name} | ${channel.id}`,
          timestamp: new Date().toISOString(),
        }
      ]
    });
  }
}
