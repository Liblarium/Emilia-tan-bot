/**
 * This file contains decorators for any functions in the codebase.
 */

import { Log } from "@log";
import { emiliaError, Checkers } from "@utils";
import { Enums } from "@constants";
import { LogCallerErrorLogicArgs, LogCallerOptions } from "@type/utils/logCaller";

/**
 * Decorator for logging method calls and handling errors.
 * 
 * This decorator logs information about the caller of the decorated method. This includes
 * the name of the caller, the method that was called, and the arguments that were passed.
 * 
 * If the decorated method returns a promise, the decorator will catch any errors that are
 * thrown and log the error message.
 * 
 * @param {LogCallerOptions} options - Options for the decorator.
 * 
 * ## Example usage:
 * @example
 * class MyClass {
 *   *@logCaller()* // don't use **
 *   myMethod() {
 *     // your code
 *   }
 * 
 *   *@logCaller({ viewArgs: true })* // if you want to log the arguments that were passed to the method. And... don't use ** on decorator lmao. This "**" using for fix JSDoc tabulation
 *   myMethods(arg1: string, arg2: number) {
 *    // for Example
 *      return arg1 + arg2; // not recommended, lol. Use number + number or string + string)
 *   }
 * }
 * 
 * const myClass = new MyClass();
 * console.log(myClass.myMethods("5", 1)); // -> 51 or error lol
 * // (your formate log): "5" 1
 */
export function logCaller(options?: LogCallerOptions): MethodDecorator {
  return (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const originalMethod = descriptor.value;
    const categories = options ? options.categories ?? [] : [];
    descriptor.value = function (...args: unknown[]) {
      if (options?.viewArgs) new Log({ text: args, type: Enums.LogType.Info, categories: ["global", "log_caller", ...categories] });

      // Add in logCategories new categories, if class have logCategories 
      if ("logCategories" in target && Array.isArray(target.logCategories) && categories.length > 0) target.logCategories = [...target.logCategories, ...categories];

      // Call the original method
      try {
        const result = originalMethod.apply(this, args);

        // If the result is a promise, handle it
        if (Checkers.isPromise(result)) {
          return result.then(res => {
            if (options?.logSuccess) loggerSuccess(propertyKey);

            return res;
          }).catch((error: Error) => {
            logCallerErrorLogic({ target, propertyKey, error });
            throw error;
          });
        }

        if (options?.logSuccess) loggerSuccess(propertyKey);

        return result;
      } catch (error) {
        logCallerErrorLogic({ target, propertyKey, error });
      }
    };

    return descriptor;
  };
}


/**
 * This function handles the logging and error handling logic for the `@logCaller` decorator.
 *
 * @param {LogCallerErrorLogicArgs} - An object containing the target object,
 * the property key of the method, and the error that occurred.
 *
 * @throws {Error} - Throws an error if the `logCategories` property is not an array.
 *
 * @returns {void} - This function does not return a value.
 */
function logCallerErrorLogic({ target, propertyKey, error }: LogCallerErrorLogicArgs): void {
  const className = target.constructor.name;
  const logCategories = "logCategories" in target ? target.logCategories : [];

  // Convert propertyKey to string
  propertyKey = String(propertyKey);

  // Check if error is an instance of Error and convert it if not
  if (!(error instanceof Error)) error = new Error(String(error));
  // Check if logCategories is an array. If not, throw an error.
  if (!Array.isArray(logCategories)) throw emiliaError(`[${className}.@logCaller.${propertyKey}]: logCategories must be an array!`, "TypeError");

  // Log error message. P.S. ind - Index, val - Value.
  [`[${propertyKey}]: ${error.message}`, error].forEach((val, ind) => new Log({
    text: val, categories: (ind === 0 ? ["global", ...logCategories] : ["log_caller"]), type: Enums.LogType.Error
  }));

  // Error message on console.
  console.error(`Error in ${propertyKey}: ${error.message}`);

  throw error;
}

/**
 * Logs a success message using the Log utility.
 * 
 * This function creates a new Log instance with the provided message,
 * setting the log type to Info and categorizing it under "global" and "log_caller".
 * 
 * @param message - The success message to be logged.
 * @returns void This function doesn't return anything.
 */
function loggerSuccess(message: string | symbol) {
  new Log({ text: `Successful call to ${String(message)}`, type: Enums.LogType.Info, categories: ["global", "log_caller"] });
}
