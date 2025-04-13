import { AbstractEvent } from "@abstract/AbstractEvent";
import type { EmiliaClient } from "@client";
import { CategoryEvents } from "@enum/EventCategoryType";
import { ErrorCode } from "@enum/errorCode";
import { LogType } from "@enum/log";
import { SlashCommand } from "@handlers/SlashCommand";
import { Log } from "@log";
import { Loggable } from "@utils/decorators/loggable";
import type { Interaction } from "discord.js";

@Loggable(Log, { text: "", type: LogType.Info, categories: ["global", "event"], tags: ["event", "interaction"], code: ErrorCode.OK })
export default class InteractionCreate extends AbstractEvent<CategoryEvents.Bot, "interactionCreate"> {
  constructor() {
    super({ name: "interactionCreate", category: CategoryEvents.Bot });
  }

  public execute(client: EmiliaClient, interaction: Interaction): void {
    if (interaction.isChatInputCommand()) new SlashCommand(interaction, client);
  }
}
