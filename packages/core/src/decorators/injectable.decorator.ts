import { container } from "tsyringe";
import type { Constructor } from "../types";

/**
 * Decorator to mark a class as injectable, allowing it to be registered
 * in the dependency injection container. This will enable the class
 * to be automatically instantiated and injected into other classes
 * where it is required.
 *
 * @template T - The type of the class to be registered.
 */
export function Injectable<T>() {
  return (target: Constructor<T>) => {
    container.register<T>(target, { useClass: target });
  };
}
