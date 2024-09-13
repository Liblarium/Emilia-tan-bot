import type {
  BaseEventsOptions,
  CategoryType,
  EventReturns,
  IBaseEvent
} from "@type/base/event";
import { EmiliaTypeError } from "@util/s";

export class BaseEvent implements IBaseEvent {
  name: string;
  once: boolean;
  category: CategoryType;

  constructor({ name, once, category }: BaseEventsOptions) {
    this.name = name;
    this.once = once ?? false;
    this.category = category;
  }


  execute(...args: unknown[]): EventReturns | Promise<EventReturns> {
    throw new EmiliaTypeError(
      `${this.name || "[Ошибка]"} не реализует метод execute!`,
    );
  }
}
