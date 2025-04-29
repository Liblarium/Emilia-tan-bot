import { type InjectionToken, inject } from "tsyringe";

/**
 * Decorator to inject a dependency into a class property or constructor
 * parameter using the specified injection token. This enables automatic
 * resolution and injection of the dependency by the dependency injection
 * container.
 *
 * @template T - The type of the dependency to be injected.
 * @param {InjectionToken<T>} service - The token representing the dependency
 * to be injected.
 * @returns A decorator function that applies the injection to the
 * specified target, property, or parameter.
 */

export function Inject<T>(service: InjectionToken<T>) {
  return (
    target: object,
    propertyKey?: string | symbol,
    parameterIndex = 0
  ) => {
    inject(service)(target, propertyKey, parameterIndex);
  };
}
