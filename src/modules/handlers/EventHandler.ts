import type { AbstractEvent } from "@abstract/AbstractEvent";
import { AbstractHandler } from "@abstract/AbstractHandler";
import type { EmiliaClient } from "@client";
import type { CategoryEvents } from "@enum/EventCategoryType";
import type {
  EventArgsType,
  EventEmitterLike,
  EventForCategory
} from "@type";
import { mongoose } from "@typegoose/typegoose";
import { setType } from "@utils/helpers/setType";

export class EventHandler
  extends AbstractHandler {
  constructor(public client: EmiliaClient) {
    super(client);
  }

  /**
   * Sets the logic for the event handler by associating the event with the appropriate event emitter.
   *
   * @template T - The category of the event. Must be a key of `CategoryEvents`.
   * @template K - The name of the event. Must be a key of `EventForCategory[T]`.
   *
   * @param module - The event module containing the event logic to be executed.
   *
   * @returns A promise that resolves when the event logic is successfully set, or void if there's no asynchronous process.
   *
   * @throws Will log and rethrow an error if the category of the module is unknown or if any issues occur during the event logic setup.
   *
   * @see {@link https://nodejs.org/api/events.html#events_class_eventemitter EventEmitter} for more information about event emitters.
   * @see {@link EventEmitterLike EventEmitterLike} for the type that represents an event emitter.
   */
  public setLogic<T extends CategoryEvents, K extends EventForCategory<T>>(
    module: AbstractEvent<T, K>
  ): void | Promise<void> {
    try {
      const eventEmitterPlug = (<T extends CategoryEvents, K extends EventForCategory<T>>(once?: boolean) => (event: string, listener: (...args: EventArgsType<T, K>) => unknown) => {
        console.log(`Unknown event${once ? " (once)" : ""}: ${event}`);

        return (...args: EventArgsType<T, K>) => listener(...args);
      });

      /**
       * @type {EventEmitterLike}
       * @see {@link https://nodejs.org/api/events.html#events_class_eventemitter EventEmitter}
       * @see {@link EventEmitterLike EventEmitterLike}
       */
      const eventEmitter: EventEmitterLike<T, K> = {
        on: eventEmitterPlug<T, K>(),
        once: eventEmitterPlug<T, K>(true)
      };

      /**
       * @type {Record<CategoryEvents, EventEmitterLike>}
       * @see {@link https://nodejs.org/api/events.html#events_class_eventemitter EventEmitter} If you need to more information for create event's
       * @see {@link EventEmitterLike EventEmitterLike} The type that represents an event emitter
       */
      const eventMap: Record<CategoryEvents, EventEmitterLike<T, K>> = {
        bot: this.client,
        mongoose: mongoose.connection,
        custom: eventEmitter,
        unknown: eventEmitter,
      };

      if (!(module.category in eventMap)) throw new Error(`Unknown category: ${module.category}`);

      eventMap[module.category][module.once ? "once" : "on"](
        setType<T>(module.name),
        module.execute,
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}