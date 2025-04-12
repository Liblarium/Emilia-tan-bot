// /**
//  * This file contains decorators for any functions in the codebase.
//  */

// import { ErrorCode } from "@constants/enum/errorCode";
// import { LogType } from "@constants/enum/log";
// import { Log } from "@log";
// import type { ClassWithLogCategories, LogCallerErrorLogicArgs, LogCallerOptions } from "@type/utils/logCaller";
// import { isPromise } from "@utils/checkers/isPromise";
// import { emiliaError } from "@utils/error/EmiliaError";


// /**
//  * Decorator for logging method calls and handling errors.
//  *
//  * This decorator logs information about the caller of the decorated method. This includes
//  * the name of the caller, the method that was called, and the arguments that were passed.
//  *
//  * If the decorated method returns a promise, the decorator will catch any errors that are
//  * thrown and log the error message.
//  *
//  * @param {LogCallerOptions} options - Options for the decorator.
//  * @param options.tags - Additional tags to categorize the log entry (e.g., ["featureX", "debug"]).
//  * @param options.metadata - Extra metadata for debugging or analytics (e.g., { userId: 123 }).
//  * @param options.context - Contextual data about the method call (e.g., { requestId: "abc123" }).
//  *
//  * ## Example usage:
//  * @example
//  * ```ts
//  * class MyClass {
//  *   *@logCaller()* // don't use **
//  *   myMethod() {
//  *     // your code
//  *   }
//  *
//  *   *@logCaller({ viewArgs: true })* // if you want to log the arguments that were passed to the method. And... don't use ** on decorator lmao. This "**" using for fix JSDoc tabulation
//  *   myMethods(arg1: string, arg2: number) {
//  *    // for Example
//  *      return arg1 + arg2; // not recommended, lol. Use number + number or string + string)
//  *   }
//  * }
//  *
//  * const myClass = new MyClass();
//  * console.log(myClass.myMethods("5", 1)); // -> 51 or error lol
//  * // (your formate log): "5" 1
//  * ```
//  */
// export function logCaller(options?: LogCallerOptions) {
//   return (target: ClassWithLogCategories, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
//     const originalMethod = descriptor.value;
//     const categories = options ? options.categories ?? [] : [];
//     descriptor.value = async function (...args: unknown[]) {
//       // Add in logCategories new categories, if class have logCategories
//       if (categories.length > 0) target.logCategories = [...target.logCategories, ...categories];

//       const tags = ["log_caller"];

//       if (options?.tags && options.tags.length > 0) tags.push(...options.tags);

//       if (options?.viewArgs) new Log({ text: args, type: LogType.Info, categories: ["global", "log_caller", ...target.logCategories], tags, code: ErrorCode.OK, metadata: options.metadata, context: options.context });

//       // Call the original method
//       try {
//         const result = await originalMethod.apply(this, args);

//         // If the result is a promise, handle it
//         if (isPromise(result)) {
//           return result.then(res => {
//             if (options?.logSuccess) loggerSuccess(propertyKey, tags, options.metadata, options.context);

//             return res;
//           }).catch((error: Error) => {
//             logCallerErrorLogic({ target, propertyKey, error, tags });

//             throw error;
//           });
//         }

//         if (options?.logSuccess) loggerSuccess(propertyKey, tags, options.metadata, options.context);

//         return result;
//       } catch (error) {
//         logCallerErrorLogic({ target, propertyKey, error, tags, metadata: options?.metadata, context: options?.context });

//         throw error;
//       }
//     };

//     return descriptor;
//   };
// }

// /**
//  * This function handles the logging and error handling logic for the `@logCaller` decorator.
//  *
//  * @param {LogCallerErrorLogicArgs} - An object containing the target object,
//  * the property key of the method, and the error that occurred.
//  *
//  * @throws {Error} - Throws an error if the `logCategories` property is not an array.
//  *
//  * @returns {void} - This function does not return a value.
//  */
// function logCallerErrorLogic({ target, propertyKey, error, tags, metadata, context }: LogCallerErrorLogicArgs): void {
//   const className = target.constructor.name;
//   const logCategories = target.logCategories;

//   // Convert propertyKey to string
//   propertyKey = String(propertyKey);

//   // Check if error is an instance of Error and convert it if not
//   if (!(error instanceof Error)) error = new Error(String(error));
//   // Check if logCategories is an array. If not, throw an error.
//   if (!Array.isArray(logCategories)) throw emiliaError(`[${className}.@logCaller.${propertyKey}]: logCategories must be an array!`, ErrorCode.UNKNOWN_ERROR, "TypeError");

//   // Log error message. P.S. ind - Index, val - Value.
//   [`[${propertyKey}]: ${error.message}`, error].forEach((val, ind) => new Log({
//     text: val,
//     categories: ind === 0 ? ["global", ...logCategories] : ["log_caller"],
//     type: LogType.Error,
//     code: ErrorCode.INVALID_TYPE,
//     tags,
//     metadata,
//     context
//   }));

//   // Error message on console.
//   console.error(`Error in ${propertyKey}: ${error.message}`);

//   throw error;
// }

// /**
//  * Logs a success message using the Log utility.
//  *
//  * This function creates a new Log instance with the provided message,
//  * setting the log type to Info and using standard log categories.
//  *
//  * @param message - The success message to be logged.
//  * @param tags - Tags to categorize the log entry.
//  * @param metadata - Optional metadata to attach to the log.
//  * @param context - Optional context information for the log.
//  * @returns void This function doesn't return anything.
//  */
// function loggerSuccess(message: string | symbol, tags: string[], metadata?: object, context?: object) {
//   new Log({
//     text: `Successful call to ${String(message)}`,
//     type: LogType.Info,
//     categories: ["global", "log_caller"],
//     tags,
//     code: ErrorCode.OK,
//     metadata,
//     context
//   });
// }
