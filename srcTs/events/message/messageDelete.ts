import type { Message, PartialMessage } from "discord.js";
import { BaseEvent } from "../../base/event";
import type { EmiliaClient } from "../../client";

export default class MessageDelete extends BaseEvent {
  constructor() {
    super({ name: "messageDelete", category: "bot" });
  }

  execute(message: Message | PartialMessage, client: EmiliaClient): undefined {
    //console.log(message);
    message; client;
  }
}
