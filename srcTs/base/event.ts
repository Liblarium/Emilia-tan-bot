import { BaseEventsOptions, CategoryType, IBaseEvent } from "@type/base/event";
import { Message, ChatInputCommandInteraction } from "discord.js"
import { EmiliaTypeError } from "../utils";
//import { Database } from "../database";
import { Log } from "../log";

export class BaseEvent implements IBaseEvent {
  name: string;
  once: boolean;
  category: CategoryType;
  //db: Database;

  constructor({ name, once, category }: BaseEventsOptions) {
    this.name = name;
    this.once = once ?? false;
    this.category = category;
    //this.db = new Database();
  }

  /**
   * @param {...any} args
   * @returns {void | Promise<void>} 
   */
  execute(...args: any[]): void | Message | ChatInputCommandInteraction | Log | Promise<void | Message | ChatInputCommandInteraction | Log> {
    throw new EmiliaTypeError(`${this?.name || [`Ошибка`]} не реализует метод execute!`);
  }
}
