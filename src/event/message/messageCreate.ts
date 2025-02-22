import type { EmiliaClient } from "@client";
import { Abstract } from "@constants";
import { MessageCommand } from "@handlers/MessageCommand";
import type { Message } from "discord.js";

export default class MessageCreate extends Abstract.AbstractEvent {
  constructor() {
    super({ name: "MessageCreate" });
  }

  public execute(message: Message, client: EmiliaClient): void {
    new MessageCommand(message, client);
  }
}
