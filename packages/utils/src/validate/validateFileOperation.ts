import { resolve } from "node:path";
import { ErrorCode } from "@emilia-tan/types";
import { emiliaError } from "../core/emiliaError";
import type { ClassWithValidator } from "../types";

/**
 * Decorator for validating file operations.
 * @example
 * ```ts
 * class MyClass {
 *    // this should be injected into the class. Required because of circular dependency
 *    readonly fileValidator: IFileValidator;
 *
 *    constructor(fileValidator: IFileValidator) {
 *      this.fileValidator = fileValidator;
 *    }
 *
 *    *@validateFileOperation<ClassWithValidator>()*
 *    myMethod(path: string) {
 *     // Code to handle file operation
 *    }
 * }
 * ```
 */
export function validateFileOperation<T extends ClassWithValidator>() {
  return (target: T, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: [string, ...unknown[]]) {
      const filePath = resolve(args[0]);

      if (!target.fileValidator)
        throw emiliaError(
          "FileValidator is not initialized!",
          ErrorCode.ARGS_REQUIRED,
          "InternalError"
        );

      const validation =
        await target.fileValidator.validateFileOperation(filePath);
      //FIXME: RXJS POWAR
      //if (!validation.success) return validation;

      return await originalMethod.apply(this, args);
    };
  };
}
