import type { Enums } from "@constants";
import type { ActionArguments } from "./action";

export interface EventArguments extends ActionArguments {
  /**
   * Whether the event should only be fired once
   * @default false - no, i want to many messages on the same event
   * @type {boolean}
   */
  once?: boolean;
  /**
   * The category of the event
   * @default Enums.EventCagetoryType.BOT - the event is a discord.js
   * @type {Enums.EventCagetoryType} if the event is a custom - you can add new type on this enum
   */
  category?: Enums.EventCagetoryType;
}