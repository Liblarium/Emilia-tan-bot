import type { Constructor, PluginOptions } from "../types";
import { getAllMetadata } from "./metadata.utils";
import { Module } from "./module.decorator";

/**
 * Decorator to mark a class as a plugin, optionally configuring its providers and controllers.
 *
 * @template T - The type of the plugin.
 * @param options - Configuration options for the plugin.
 * @param options.providers - Providers to register in the plugin's container.
 * @param options.events - Event handlers to register in the plugin's container.
 * @param options.commands - Command handlers to register in the plugin's container.
 * @param options.exports - Tokens to export from the plugin's container.
 * @param options.restrictExports - If true, restricts export of controllers and providers to only the tokens specified in options.exports.
 * @param options.debug - Enables debugging logs if set to true.
 *
 * To use the plugin, you must call the `initModule` function on an instance of this class.
 *
 * @example
 * ```ts
 * @Plugin()
 * class MyPlugin {
 *   constructor(private readonly myService: MyService) {}
 * }
 *
 * await initModule(MyPlugin);
 * ```
 *
 *  @see {@link Module}
 *  Use initModule to initialize the plugin
 *
 * **Note**: This decorator should be applied to a class that has been decorated with the `Injectable` decorator.
 * **P.S.** The `Injectable` decorator is automatically applied when using the `Plugin` decorator.
 */
export function Plugin<T>(options: PluginOptions = {}) {
  return (constructor: Constructor<T>): void => {
    const providers = [
      ...(options.providers || []),
      ...(options.events || []).map((event) => {
        const metadata = getAllMetadata(event);

        if (metadata?.globals) return { provide: metadata.token || event, useClass: event };

        return {
          provide: metadata?.token || event,
          useClass: event,
          scope: metadata?.scope || "singleton",
        };
      }),
      ...(options.commands || []).map((command) => {
        const metadata = getAllMetadata(command);

        if (metadata?.globals) return { provide: metadata.token || command, useClass: command };

        return {
          provide: metadata?.token || command,
          useClass: command,
          scope: metadata?.scope || "singleton",
        };
      }),
    ];

    Module({
      ...options,
      providers,
      exports: options.exports || [],
      restrictExports: options.restrictExports,
      debug: options.debug,
    })(constructor);

    Reflect.defineMetadata("plugin:events", options.events || [], constructor);
    Reflect.defineMetadata("plugin:commands", options.commands || [], constructor);
  };
}
