import type { EmiliaClient } from "@client";
import type { CategoryEvents } from "@enums/EventCategory";
import type { Keyof } from "@type";
import type { ClientEvents } from "discord.js";

/**
 * Maps event categories to their corresponding event names
 */
export type CategoryEventsMap = {
  /** Discord.js client events */
  bot: Keyof<ClientEvents>;
  /** Mongoose connection events */
  mongoose: Keyof<MongooseEvents>;
  /** Custom event - you can create your own. Recommended: add there your category event */
  custom: unknown;
  /** Custom events */
  none: unknown;
};

/**
 * Type for the client argument on event
 */
type ClientArgumentOnEvent = [client: EmiliaClient];

/**
 * Type for event handler function
 */
export type EventForCategory<T extends CategoryEvents> = CategoryEventsMap[T];

/**
 * Determines the argument types for a given event category and event name.
 * 
 * @template T - The category of the event.
 * @template K - The name of the event.
 * 
 * If the category is "bot", it uses the corresponding ClientEvents type.
 * If the category is "mongoose", it uses the corresponding MongooseEvents type.
 * Otherwise, it defaults to an array of unknown types.
 */
export type EventArgsType<T extends CategoryEvents, K extends EventForCategory<T>> =
  T extends "bot" ? [...ClientArgumentOnEvent, ...ClientEvents[K]] :
  T extends "mongoose" ? [...MongooseEvents[K]] :
  [...UnknownEvents[K]];

/**
 * Represents an abstract event
 * 
 * @template T - The category of the event. Must be a key of `CategoryEventsMap`
 * 
 * @template K - The name of the event. Must be a key of `EventForCategory[T]`
 * 
 * @see {@link CategoryEvents CategoryEvents} If you need to more other events - edit CategoryEvents
 * 
 * If you need other event arguments - use `NoneEvents` on T
 * 
 * @see {@link ClientEvents ClientEvents} (he in code) or {@link https://discord.js.org/docs/packages/discord.js/main/ClientEventTypes:Interface ClientEventTypes} for `discord.js` docs
 * @see {@link MongooseEvents MongooseEvents} (he in code)
 */
export interface IAbstractEvent<T extends CategoryEvents, K extends EventForCategory<T>> {
  /**
   * The name of the event
   */
  name: K;
  /**
   * The category of the event
   */
  category: T;
  /**
   * Whether the event should be executed only once. Defaults to undefined
   */
  once?: boolean;

  execute(...args: EventArgsType<T, K>): unknown | Promise<unknown>;
}

/**
 * Represents the options for creating an event.
 *
 * @template T - The category of the event. Must be a key of `CategoryEvents`
 * @template K - The name of the event. Must be a key of `EventForCategory[T]`
 */
export interface AbstractEventOptions<
  T extends CategoryEvents,
  K extends EventForCategory<T>
> {
  /**
     * The name of the event.
     * @type {K} - The name of the event. Must be a key of `EventForCategory[T]`
     */
  name: K;
  /**
   * The category of the event.
   * @type {T} - The category of the event. Must be a key of `CategoryEvents`
   */
  category: T;
  /**
   * Whether the event should only be triggered once.
   * @type {boolean} - Whether the event should only be triggered once
   */
  once?: boolean;
  /**
   * The categories to log the event to.
   * @type {ArrayNotEmpty<string>} - The categories to log the event to
   */
  logCategories?: ArrayNotEmpty<string>;
}

/**
 * Represents mongoose connection events
 * @see {@link https://mongoosejs.com/docs/connections.html#connection-events Mongoose Connection Events}
 */
export interface MongooseEvents {
  /**
   * Called when the connection to the database is established
   */
  connected: [];

  /**
   * Called when the connection to the database is closed
   */
  disconnected: [];

  /**
   * Called if an error occurs while connecting or working with the database
   * @param error - The error that occurred
   */
  error: [error: Error];

  /**
   * Called when Mongoose starts the connection process
   * @param uri - The connection URI being used
   */
  connecting: [uri: string];

  /**
   * Called when the connection is re-established after a disconnection
   * @param ref - Connection reference information
   */
  reconnected: [ref: { id: number; host: string }];

  /**
   * Called when the connection is completely closed
   * @param force - Whether the connection was force closed
   */
  close: [force: boolean];

  /**
   * Called when connection is lost
   * @param error - The error that caused the disconnection
   */
  disconnecting: [error: Error | undefined];

  /**
   * Called when connection fails to establish
   * @param error - The error that prevented connection
   */
  connectionFailed: [error: Error];
}

/**
 * Fallback interface for custom events
 * Used when event category is 'none'
 */
export interface UnknownEvents {
  [key: unknown]: unknown[];
}
