import type { EmiliaClient } from "@client";
import { AbstractEvent } from "@constants/abstract/AbstractEvent";
import { CategoryEvents } from "@constants/enum/EventCategoryType";
import { MessageCommand } from "@handlers/MessageCommand";
import type { Message } from "discord.js";

export default class MessageCreate extends AbstractEvent<
  CategoryEvents.BOT,
  "messageCreate"
> {
  constructor() {
    super({ name: "messageCreate", category: CategoryEvents.BOT });
  }

  public execute(client: EmiliaClient, message: Message): void {
    new MessageCommand(message, client);
  }
}
