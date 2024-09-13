import type { Log } from "@log";
import type { ChatInputCommandInteraction, Message } from "discord.js";

export type CategoryType = `bot` | `mongo`;

export type EventReturns = void | Message | ChatInputCommandInteraction | Log;
export interface BaseEventsOptions {
  name: string;
  category: CategoryType;
  once?: boolean;
}
export interface IBaseEvent {
  name: string;
  once: boolean;
  category: CategoryType;

  execute: (...args: unknown[]) => EventReturns | Promise<EventReturns>;
}
