import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import type { /*ChannelType,*/ VoiceState } from "discord.js";

//const { GuildVoice } = ChannelType;

export default class VoiceStateUpdate extends BaseEvent {
  constructor() {
    super({
      name: "VoiceStateUpdate",
      category: "bot",
    });
  }

  execute(
    oldState: VoiceState,
    newState: VoiceState,
    client: EmiliaClient,
  ): undefined { }
}
