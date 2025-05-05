import { type InjectionToken, container, injectable } from "tsyringe";
import type { Constructor } from "../types";

/**
 * Decorator to mark a class as a singleton, ensuring that only one instance
 * is created and shared throughout the application. If a custom injection
 * token is provided, the singleton will be registered with that token;
 * otherwise, the class itself will be used as the token.
 *
 * @template T - The type of the class to be registered as a singleton.
 * @param {InjectionToken<T>} [token] - Optional token for the singleton registration.
 * @returns A decorator function that registers the class as a singleton
 * in the dependency injection container.
 */
export function Singleton<T>(token?: InjectionToken<T>, debug?: boolean) {
  return (target: Constructor<T>) => {
    injectable<T>()(target);
    container.registerSingleton<T>(
      typeof token === "string" ? token : target,
      target
    );

    if (debug)
      console.log(`Singleton registered: ${token?.toString() || target.name}`);
  };
}
