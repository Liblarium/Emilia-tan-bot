import { AbstractEvent } from "@abstract/AbstractEvent";
import type { EmiliaClient } from "@client";
import { CategoryEvents } from "@enum/EventCategoryType";
import { MessageCommand } from "@handlers/MessageCommand";
import type { Message } from "discord.js";

export default class MessageCreate extends AbstractEvent<
  CategoryEvents.Bot,
  "messageCreate"
> {
  constructor() {
    super({ name: "messageCreate", category: CategoryEvents.Bot });
  }

  public execute(client: EmiliaClient, message: Message): void {
    new MessageCommand(message, client);
  }
}
