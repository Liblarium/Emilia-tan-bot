import { LogType } from "@enum/log";
import type { Log } from "@log";
import { PinoLogger } from "@log/PinoLogger";
import { FileLogger } from "@log/FileLogger";
import type { LogOptions, LogTags } from "@type";
import type { PinoLoggerOptions } from "@type/log/pino";
import { merge } from "lodash";

/**
 * Parameter-level decorator for logging parameter values.
 * Stores metadata about which parameters to log.
 * @returns Decorator function.
 * @throws {Error} If logger is not initialized.
 * @example
 * ```ts
 * \@Loggable(Log, { type: LogType.Info, categories: ["class"] })
 *  class MyClass {
 *   \@LogMethodWithParams({ type: LogType.Debug, tags: ["method"] })
 *   myMethod(\@LogParam() param1: string, \@LogParam() param2: number) {
 *     console.log(`Executing myMethod with ${param1} and ${param2}`);
 *   }
 * }
 *
 * const instance = new MyClass();
 * instance.myMethod("test", 42);
 * ```
 */
export function LogParam() {
  return (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) => {
    const existingParams: number[] =
      Reflect.getOwnMetadata("logParams", target, propertyKey) || [];
    existingParams.push(parameterIndex);
    Reflect.defineMetadata("logParams", existingParams, target, propertyKey);
  };
}

/**
 * Method-level decorator for logging specific methods.
 * Merges method-level options with class-level options.
 * @param logOptions - Options for logging (e.g., log level, tags, etc.).
 * @returns Decorator function.
 * @throws {Error} If logger is not initialized.
 * @example
 * ```ts
 * @Loggable(Log, { type: LogType.Info, categories: ["featureX"], tags: ["featureX", "debug"] })
 * class MyClass {
 *   @LogMethod({ type: LogType.Info, tags: ["featureX", "debug"] })
 *   myMethod() {
 *     // Method logic
 *   }
 * }
 * ```
 */
export function LogMethod(logOptions: {
  type?: LogType;
  tags?: LogTags;
  categories?: string[];
}) {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      this: any,
      ...args: any[]
    ): Promise<any> {
      const logger = Reflect.getMetadata("logger", target);
      const classOptions = Reflect.getMetadata("classLogOptions", target) || {};

      if (!logger) {
        console.warn(
          `Logger not initialized for method ${String(propertyKey)}. Did you forget to use @Loggable?`,
        );
        return originalMethod.apply(this, args);
      }

      // Merge class-level and method-level options
      const mergedOptions = merge(classOptions, logOptions);

      try {
        // Log method call
        await logger.logProcessing({
          text: `Calling method ${String(propertyKey)}${args.length ? ` with arguments: ${JSON.stringify(args)}` : ""
            }`,
          type: mergedOptions.type || LogType.Debug,
          categories: mergedOptions.categories || ["method_call"],
          tags: mergedOptions.tags || [String(propertyKey), "method_logging"],
          inline: 1,
        });

        // Execute the original method
        const result = await originalMethod.apply(this, args);

        // Log successful execution
        await logger.logProcessing({
          text: `Method ${String(propertyKey)} executed successfully${result !== undefined ? `. Result: ${JSON.stringify(result)}` : ""
            }`,
          type: LogType.Info,
          categories: mergedOptions.categories || ["method_success"],
          tags: mergedOptions.tags || [String(propertyKey), "method_logging"],
          inline: 2,
        });

        return result;
      } catch (error) {
        // Log error
        await logger.logProcessing({
          text: `Error in method ${String(propertyKey)}: ${error instanceof Error ? error.message : String(error)
            }`,
          type: LogType.Error,
          categories: mergedOptions.categories || ["method_error"],
          tags: mergedOptions.tags || [
            String(propertyKey),
            "method_logging",
            "error",
          ],
          inline: 2,
        });

        throw error; // Re-throw the error
      }
    };

    return descriptor;
  };
}

/**
 * Method-level decorator for logging specific methods.
 * 
 * Logs parameter values if `LogParam` is used.
 * 
 * Merges method-level options with class-level options.
 * @param logOptions - Options for logging (e.g., log level, tags, etc.).
 * @param logParams - Array of parameter indices to log.
 * @returns Decorator function.
 * @throws {Error} If logger is not initialized.
 * @example
 * ```ts
 * \@Loggable(Log, { type: LogType.Info, categories: ["featureX"], tags: ["featureX", "debug"] })
 * class MyClass {
 *   \@LogMethodWithParams({ type: LogType.Info, tags: ["featureX", "debug"] }, [0, 1])
 *   myMethod(param1: string, param2: number) {
 *     console.log(`Executing myMethod with ${param1} and ${param2}`);
 *   }
 * }
 */
export function LogMethodWithParams(logOptions: {
  type?: LogType;
  tags?: LogTags;
  categories?: string[];
}) {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      this: any,
      ...args: any[]
    ): Promise<any> {
      const logger = Reflect.getMetadata("logger", target);
      const classOptions = Reflect.getMetadata("classLogOptions", target) || {};
      const paramIndices: number[] =
        Reflect.getOwnMetadata("logParams", target, propertyKey) || [];

      if (!logger) {
        console.warn(
          `Logger not initialized for method ${String(propertyKey)}. Did you forget to use @Loggable?`,
        );
        return originalMethod.apply(this, args);
      }

      // Merge class-level and method-level options
      const mergedOptions = merge(classOptions, logOptions);

      try {
        // Log method call with parameter values
        const paramLogs = paramIndices
          .map((index) => `Param[${index}]: ${JSON.stringify(args[index])}`)
          .join(", ");
        await logger.logProcessing({
          text: `Calling method ${String(propertyKey)}${paramLogs ? ` with parameters: ${paramLogs}` : ""}`,
          type: mergedOptions.type || LogType.Debug,
          categories: mergedOptions.categories || ["method_call"],
          tags: mergedOptions.tags || [String(propertyKey), "method_logging"],
          inline: 1,
        });

        // Execute the original method
        const result = await originalMethod.apply(this, args);

        // Log successful execution
        await logger.logProcessing({
          text: `Method ${String(propertyKey)} executed successfully${result !== undefined ? `. Result: ${JSON.stringify(result)}` : ""
            }`,
          type: LogType.Info,
          categories: mergedOptions.categories || ["method_success"],
          tags: mergedOptions.tags || [String(propertyKey), "method_logging"],
          inline: 2,
        });

        return result;
      } catch (error) {
        // Log error
        await logger.logProcessing({
          text: `Error in method ${String(propertyKey)}: ${error instanceof Error ? error.message : String(error)
            }`,
          type: LogType.Error,
          categories: mergedOptions.categories || ["method_error"],
          tags: mergedOptions.tags || [
            String(propertyKey),
            "method_logging",
            "error",
          ],
          inline: 2,
        });

        throw error; // Re-throw the error
      }
    };

    return descriptor;
  };
}

/**
 * Class-level decorator for initializing the logger.
 * Stores the logger instance and class-level options in metadata for use by method-level decorators.
 * @returns Decorator function.
 * @example
 * ```ts
 * \@Loggable(Log, { type: LogType.Info, categories: ["featureX"], tags: ["featureX", "debug"] })
 * class MyClass {
 *   constructor() {
 *     // Constructor logic
 *   }
 *
 *   \@LogMethod({ type: LogType.Info, tags: ["featureX", "debug"] })
 *   myMethod() {
 *     // Method logic
 *   }
 * }
 */
export function Loggable<T extends new (...args: any[]) => {}>(
  logClass: typeof Log,
  options: Omit<LogOptions, "logFormatter" | "consoleLogger" | "fileLogger">,
  pinoOptions?: PinoLoggerOptions
) {
  return (constructor: T) =>
    class extends constructor {
      readonly _logger: Log = new logClass();

      constructor(...args: any[]) {
        super(...args);

        this._logger = new logClass();
        this._logger.logProcessing({
          consoleLogger: new PinoLogger(pinoOptions),
          fileLogger: new FileLogger("logs", {
            rotateInterval: "1d",
            rotateSize: "10m",
            pretty: true
          }),
          ...options,
        });

        // Store the logger and class-level options in metadata
        Reflect.defineMetadata("logger", this._logger, constructor.prototype);
        Reflect.defineMetadata(
          "classLogOptions",
          options,
          constructor.prototype,
        );
      }

      // Public access to the logger
      get logger(): Log {
        return this._logger;
      }
    };
}
