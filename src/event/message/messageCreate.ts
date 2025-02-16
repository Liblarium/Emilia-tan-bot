import { EmiliaClient } from "@client";
import { Abstract } from "@constants";
import { Message } from "discord.js";
import { MessageCommand } from "@handlers/MessageCommand";

export default class MessageCreate extends Abstract.AbstractEvent {
  constructor() {
    super({ name: "MessageCreate" });
  }

  public execute(message: Message, client: EmiliaClient): void {
    new MessageCommand(message, client);
  }
}