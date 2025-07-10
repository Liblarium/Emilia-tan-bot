import { container } from "../index";
import type { Constructor, InjectableOptions } from "../types";
import { bindUseClass, bindUseFactory, bindUseValue, debugLog } from "./metadata.utils";

const INJECTABLE_METADATA_KEY = Symbol("injectable:options");

/**
 * Decorator to mark a class as injectable, optionally configuring its injection behavior.
 *
 * @template T - The type of the injectable service.
 * @param options - Configuration options for the injectable service.
 * @param options.token - An optional token to uniquely identify the injectable.
 * @param options.scope - The scope of the service, can be "singleton" or "transient".
 * @param options.debug - Enables debugging logs if set to true.
 * @param options.globals - If true, registers the service globally; otherwise, only metadata is stored.
 * @param options.useClass - Specifies a class to use for the injection instead of the target.
 * @param options.useValue - Specifies a constant value to use for the injection.
 * @param options.useFactory - A factory function to create the service instance.
 *
 * @throws {Error} If no token is provided for the injectable.
 * @throws {Error} If a local injectable does not have a target class.
 * @throws {Error} If an invalid global injectable configuration is provided.
 */
export function Injectable<T>(options: InjectableOptions<T> = {}) {
  return (target?: Constructor<T>): void => {
    const { debug } = options;
    const token = options.token || target;

    if (!token) throw new Error("No token provided for injectable");

    // Local Services - Local Metadata Registration
    if (!options.globals) {
      if (!target) throw new Error("Local injectable requires a target class");

      Reflect.defineMetadata(INJECTABLE_METADATA_KEY, options, target);

      return;
    }

    // Global Services - Registration in Container
    try {
      if (container.isBound(token))
        return debugLog(debug, `Global injectable already registered: ${String(token)}`);

      const useClass = options.useClass || target;
      const { scope } = options;

      switch (true) {
        case Boolean(useClass):
          bindUseClass(container, { token, useClass, scope, debug });
          break;

        case "useValue" in options && options.useValue !== undefined:
          bindUseValue(container, { token, useValue: options.useValue, debug });
          break;

        case Boolean(options.useFactory):
          bindUseFactory(container, {
            token,
            useFactory: options.useFactory,
            scope,
            debug,
          });
          break;

        default:
          throw new Error(`Invalid global injectable configuration: ${String(token)}`);
      }
    } catch (e) {
      console.error(`Global injectable registration failed: ${String(token)}`, e);

      if (debug) throw e;
    }
  };
}

/**
 * Retrieves the metadata associated with the given target, if any.
 *
 * @template T
 * @param target The target class to retrieve the metadata for.
 * @returns The metadata associated with the target, or undefined if none is found.
 *
 * This function is a convenience wrapper for `Reflect.getMetadata(INJECTABLE_METADATA_KEY, target)`.
 */
export function getInjectableMetadata<T>(target: Constructor<T>): InjectableOptions<T> | undefined {
  return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target);
}

export { container };
