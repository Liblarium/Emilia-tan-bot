import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import { Log } from "@log";
import type { GuildChannel } from "discord.js";

export class ChannelDelete extends BaseEvent {
  execute(channel: GuildChannel, client: EmiliaClient) {
    new Log({
      // TODO: Release this event
      text: "This event not released",
      type: "error",
      categories: ["global", "event"],
    });
    return undefined;
  }
}
