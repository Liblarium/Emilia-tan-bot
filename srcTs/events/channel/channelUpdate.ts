import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import { EventActions, GuildLogsIntents, getGuildLogSettingFromDB, hexToDecimal } from "@util/s";
import type { DMChannel, NonThreadGuildBasedChannel } from "discord.js";

export default class ChannelUpdate extends BaseEvent {
  constructor() {
    super({
      name: "channelUpdate",
      category: "bot",
    });
  }

  async execute(oldChannel: DMChannel | NonThreadGuildBasedChannel, newChannel: DMChannel | NonThreadGuildBasedChannel, client: EmiliaClient) {
    if (oldChannel.isDMBased() || newChannel.isDMBased() || oldChannel.name === newChannel.name) return;

    const channel = await getGuildLogSettingFromDB({
      guildId: newChannel.guild.id,
      select: { channel: true },
      intents: GuildLogsIntents.CHANNEL | EventActions.UPDATE,
      messageType: "update",
      message: newChannel
    });

    if (!channel) return;

    channel.send({
      embeds: [{
        title: "Изменение канала",
        color: hexToDecimal("#ffa600"),
        description: `${oldChannel.name} -> ${newChannel.name} (${newChannel.id})`,
        timestamp: new Date().toISOString(),
      }]
    });
  }
}
