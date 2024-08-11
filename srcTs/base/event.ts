import type { ChatInputCommandInteraction, Message } from "discord.js";
import type {
  BaseEventsOptions,
  CategoryType,
  IBaseEvent,
} from "../../types/base/event";
//import { Database } from "../database";
import type { Log } from "../log";
import { EmiliaTypeError } from "../utils";

export class BaseEvent implements IBaseEvent {
  name: string;
  once: boolean;
  category: CategoryType;
  //db: Database;

  constructor({ name, once, category }: BaseEventsOptions) {
    this.name = name;
    this.once = once ?? false;
    this.category = category;
    //this.db abase();
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  execute(...args: unknown[]):
    | undefined
    | Message
    | ChatInputCommandInteraction
    | Log
    | Promise<undefined | Message | ChatInputCommandInteraction | Log> {
    throw new EmiliaTypeError(
      `${this.name || "[Ошибка]"} не реализует метод execute!`,
    );
  }
}
