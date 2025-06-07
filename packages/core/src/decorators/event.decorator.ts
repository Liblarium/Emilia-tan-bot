import type { Constructor, EventOptions } from "../types";
import { Injectable } from "./injectable.decorator";

const EVENT_METADATA_KEY = Symbol("event:options");

/**
 * Marks the class as an event.
 * @param options Event settings
 * @param options.event Event name
 * @param options.source Event source
 * @param options.once If true, the event is a one-time event
 * @param options.token Token for injection
 * @param options.scope Scope
 * @param options.debug Enable debugging
 * @param options.global If true, the event is global
 */
export function Event<T>(options: EventOptions<T>) {
  return (target: Constructor<T>): void => {
    Reflect.defineMetadata(EVENT_METADATA_KEY, options, target);
    Injectable(options)(target);
  };
}

/**
 * Retrieves the event metadata associated with the given target, if any.
 *
 * @template T
 * @param target The target class to retrieve the metadata for.
 * @returns The metadata associated with the target, or undefined if none is found.
 *
 * This function is a convenience wrapper for `Reflect.getMetadata(EVENT_METADATA_KEY, target)`.
 */
export function getEventMetadata<T>(target: Constructor<T>): EventOptions<T> | undefined {
  return Reflect.getMetadata(EVENT_METADATA_KEY, target);
}
