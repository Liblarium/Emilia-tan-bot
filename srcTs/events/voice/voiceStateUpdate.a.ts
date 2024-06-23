import { type VoiceState, ChannelType } from "discord.js";
import { type EmiliaClient } from "../../client";
import { BaseEvent } from "../../base/event";


const { GuildVoice } = ChannelType;

export default class VoiceStateUpdate extends BaseEvent {
  constructor() {
    super({
      name: `VoiceStateUpdate`,
      category: `bot`
    });
  }

  async execute(oldState: VoiceState, newState: VoiceState, client: EmiliaClient) {

  }
}