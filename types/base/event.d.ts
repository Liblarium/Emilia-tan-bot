import { Message, ChatInputCommandInteraction } from "discord.js";
//import { Database } from "../../srcTs/database";
import { Log } from "../../srcTs/log";

export type CategoryType = `bot` | `mongo`;
export interface BaseEventsOptions {
  name: string;
  category: CategoryType;
  once?: boolean
}
export interface IBaseEvent {
  name: string;
  once: boolean;
  category: CategoryType;
  //db: Database;

  execute: (...args: any[]) => void | Message | ChatInputCommandInteraction | Log | Promise<void | Message | ChatInputCommandInteraction | Log>;
}
