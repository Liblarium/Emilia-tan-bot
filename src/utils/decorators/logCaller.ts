/**
 * This file contains decorators for any functions in the codebase.
 */

import { Log } from "@log";
import { emiliaError } from "@utils";

/**
 * Decorator for logging method calls and handling errors.
 * 
 * ## Example usage:
 * @example
 * class MyClass {
 *   *@logCaller* //not use **
 *   myMethod() {
 *     // your code
 *   }
 * }
 */
export function logCaller(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: unknown[]) {
    try {
      return originalMethod.apply(this, args);
    } catch (error) {
      const className = target.constructor.name;
      const logCategories = "logCategories" in target ? target.logCategories : [];

      if (!Array.isArray(logCategories)) throw emiliaError(`[${className}.@logCaller.${propertyKey}]: logCategories must be an array!`, "TypeError");

      new Log({ text: `[${propertyKey}]: ${error.message}`, type: 2, categories: ["global", ...logCategories] });
      console.error(`Error in ${propertyKey}: ${error.message}`);
      new Log({ text: error, type: 2, categories: ["log_caller"] });

      throw error;
    }
  };
  return descriptor;
}
