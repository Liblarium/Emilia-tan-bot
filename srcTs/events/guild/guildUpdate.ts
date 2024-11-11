import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import { Log } from "@log";
import type { GuildMember } from "discord.js";

export class GuildUpdate extends BaseEvent {
  execute(member: GuildMember, client: EmiliaClient): undefined {
    new Log({
      // TODO: Release this event
      text: "This event not released",
      type: "error",
      categories: ["global", "event"],
    });
    return undefined;
  }
}
