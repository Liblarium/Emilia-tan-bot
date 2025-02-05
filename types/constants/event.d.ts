import type { EventCagetoryType } from "@constants/enum/EventCagetoryType";
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
   * @default EventCagetoryType.BOT - the event is a discord.js
   * @type {EventCagetoryType} if the event is a custom - you can add new type on this enum
   */
  category?: EventCagetoryType;
}