import type { CategoryEvents } from "@enum/EventCategoryType";
import type { EventArgsType, EventForCategory } from "@type";

interface lListener {
  /**
   * @param args The callback function
   */
  (...args: unknown[]): void;
}

/**
 * A type that represents an event emitter
 *
 * @see {@link https://nodejs.org/api/events.html#events_class_eventemitter EventEmitter}
 */
export interface EventEmitterLike<
  T extends CategoryEvents,
  K extends EventForCategory<T>
> {
  /**
   * Adds the `listener` function to the end of the listeners array for the
   * event named `eventName`. No checks are made to see if the `listener` has
   * already been added. Multiple calls passing the same combination of
   * `eventName` and `listener` will result in the `listener` being added,
   * and called, multiple times.
   *
   * @param {string} eventName The name of the event
   * @param {lListener} listener The callback function
   * @returns {EventEmitterLike} The emitter
   */
  on: (
    event: T,
    listener: ListenerFunction<T, K>,
  ) => unknown;
  /**
   * Adds a **one-time** `listener` function for the event named `eventName`. The
   * next time `eventName` is triggered, this listener is removed and then invoked.
   *
   * @param {string} eventName The name of the event
   * @param {lListener} listener The callback function
   * @returns {EventEmitterLike} The emitter
   */
  once: (
    event: T,
    listener: ListenerFunction<T, K>,
  ) => unknown;
}

/**
 * A type that represents a listener function
 * 
 * @see {@link https://nodejs.org/api/events.html#events_class_eventemitter EventEmitter}
 */
type ListenerFunction<
  T extends CategoryEvents,
  K extends EventForCategory<T>
> = (...args: EventArgsType<T, K>) => unknown;