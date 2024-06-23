import type { Message, PartialMessage } from "discord.js";
import type { EmiliaClient } from "../../client";
import { BaseEvent } from "../../base/event";

export default class MessageDelete extends BaseEvent {
  constructor() {
    super({ name: `messageDelete`, category: `bot` });
  }

  execute(message: Message | PartialMessage, client: EmiliaClient) {
    //console.log(message);
  }
}
