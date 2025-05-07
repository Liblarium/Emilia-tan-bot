import { container } from "tsyringe";
import type { Constructor } from "../types";

/**
 * Marks a class as a service, which will be automatically registered in the
 * dependency injection container. This allows the service to be injected
 * into other classes that require it.
 * @example
 * ```ts
 * class MyService {
 *   someMethod() { ... }
 * }
 *
 * \@Service() // \ fixed this line in JSDoc
 * class MyClass {
 *   constructor(private readonly myService: MyService) { }
 *
 *   someMethod() {
 *     this.myService.someMethod();
 *   }
 * }
 * ```
 */
export function Service<T>() {
  return (target: Constructor<T>) => {
    Reflect.defineMetadata("service", true, target); // We mark as service
    // container.register<T>(target, { useClass: target }); // Register as Module
  };
}
