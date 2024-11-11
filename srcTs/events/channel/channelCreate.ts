import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import { Log } from "@log";
import type { GuildChannel } from "discord.js";

export default class ChannelCreate extends BaseEvent {
  constructor() {
    super({
      name: "channelCreate",
      once: false,
      category: "bot",
    });
  }

  execute(channel: GuildChannel, client: EmiliaClient) {
    new Log({
      // TODO: Release this event
      text: "This Category not released",
      type: "error",
      categories: ["global", "handler", "event"],
    });
  }
}
