import type { CategoryEvents } from "@enum/EventCategoryType";
import type {
  AbstractEventOptions,
  ArrayNotEmpty,
  EventArgsType,
  EventForCategory,
  IAbstractEvent,
} from "@type";
import { AbstractAction } from "./AbstractAction.js";

/**
 * Represents an abstract event.
 *
 * @template T - The name of the event. Must be a key of `ClientEvents`
 * @template K - The name of the event. Must be a key of `EventForCategory[T]`
 *
 * If you need to more other events - edit EventsType
 * @see {@link EventsType EventsType}.
 *
 * If you need other event arguments - use `"unknown"` on T
 */
export abstract class AbstractEvent<
  T extends CategoryEvents,
  K extends EventForCategory<T>,
>
  extends AbstractAction<K>
  implements IAbstractEvent<T, K> {
  public readonly category: T;
  public logCategories: ArrayNotEmpty<string> = ["event"];
  public readonly once: boolean = false;

  constructor({
    name,
    category,
    once,
    logCategories,
  }: AbstractEventOptions<T, K>) {
    super(name);
    this.category = category;
    this.once = once ?? false;
    this.logCategories = logCategories ?? ["event"];
  }

  /**
   * Executes the event logic
   * @template R - The type of the return value
   * @param args The arguments to pass to the event
   */
  public abstract execute(
    ...args: EventArgsType<T, K>
  ): unknown | Promise<unknown>;
}