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
import { fromEvent, Subject } from 'rxjs';
import type { JQueryStyleEventEmitter } from "rxjs/internal/observable/fromEvent";


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
  ): void {
    try {
      // Создаём Subject для событий
      const eventSubject = new Subject<EventArgsType<T, K>>();

      // Определяем EventEmitter для кастомных событий
      const eventEmitterPlug = (once?: boolean) => (
        event: string,
        listener: (args: EventArgsType<T, K>) => unknown
      ) => {
        console.log(`Unknown event${once ? " (once)" : ""}: ${event}`);
        return (args: EventArgsType<T, K>) => listener(args);
      };

      const eventEmitter: EventEmitterLike<T, K> = {
        on: eventEmitterPlug(),
        once: eventEmitterPlug(true),
        off: (event, listener) => {
          const subscription = eventSubject.subscribe((value: EventArgsType<T, K>) => listener(value));

          subscription.unsubscribe();

          console.log(`Listener for event ${event} removed.`);
        },
      };

      // Map event categories to event emitters
      const eventMap: Record<CategoryEvents, EventEmitterLike<T, K>> = {
        bot: this.client,
        mongoose: mongoose.connection,
        custom: eventEmitter,
        unknown: eventEmitter,
      };

      if (!(module.category in eventMap)) {
        throw new Error(`Unknown category: ${module.category}`);
      }

      // Создаём Observable для событий
      const event$ = fromEvent<EventArgsType<T, K>>(
        adaptEventEmitter(eventMap[module.category]),
        setType<T>(module.name)
      );

      // Подписываемся на события и выполняем логику модуля
      event$.subscribe({
        next: (args) => module.execute(args),
        error: (err) => console.error(`Error in event ${module.name}:`, err),
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

/**
 * Adapts an EventEmitterLike to a JQueryStyleEventEmitter
 * @param emitter The event emitter to adapt
 * @returns A JQueryStyleEventEmitter that emits the same events as the original emitter
 */
function adaptEventEmitter<T extends CategoryEvents, K extends EventForCategory<T>>(
  emitter: EventEmitterLike<T, K>
): JQueryStyleEventEmitter<any, EventArgsType<T, K>> {
  return {
    on(eventName: T, handler: (this: any, t: EventArgsType<T, K>, ...args: any[]) => any): void {
      emitter.on(eventName, (...args: any[]) => handler(args[0] as EventArgsType<T, K>));
    },
    off: emitter.off ? emitter.off?.bind(emitter) : () => { }
  };
}