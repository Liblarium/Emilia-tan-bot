import { resolve } from "node:path";
import type { ClassWithValidator } from "@type/utils/file";

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
  return (
    target: T,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: [string, ...unknown[]]) {
      const filePath = resolve(args[0]);
      const validation =
        await target.fileValidator.validateFileOperation(filePath);

      if (!validation.success) return validation;

      return originalMethod.apply(this, args);
    };
  };
}
