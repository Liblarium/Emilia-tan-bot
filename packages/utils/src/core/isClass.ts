import type { IisClass, IsClassOptions, MethodCountOptions } from "../types";

/**
 * Checks if the given object is a class.
 *
 * Have a Error/TypeError in console, on return - false
 *
 * If you have very deep inheritance - function will return all count on 10 deep level
 *
 * @param obj - The object to check.
 * @param methods - Whether to check if the class has methods.
 * @returns {boolean} Returns `true` if the object is a class, `false` otherwise.
 * @throws {false} You have a Error/TypeError in console, on return - false
 *
 * @example
 * ```ts
 * class MyClass {}
 *
 * class MyClass2 {
 *   test() {}
 * }
 *
 * class MyClass3 {
 *  test() {}
 *  test2() {}
 *}
 *
 * class MyClass4 extends MyClass2 {}
 *
 * isClass(MyClass); // true - he is a class
 * isClass({}); // false - object
 * isClass(null); // false - null or undefined
 * isClass(() => {}); // false - function
 * isClass(Map); // false - built-in constructor
 * isClass(MyClass, { checkMethods: true }); // false - no methods
 * isClass(MyClass2, { checkMethods: true }); // true - has method's (constructor is ignored)
 * isClass(MyClass2, { checkMethods: true, methodCount: 1 }); // true - has 1 method
 * isClass(MyClass3, { checkMethods: true, methodCount: { min: 1, max: 2 } }); // true - has 1-2 methods
 * isClass(MyClass4, { checkMethods: true, { min: 1, max: 2 }}); // true - extends methods count at this check
 * ```
 */
export const isClass: IisClass = (
  obj: unknown,
  options: IsClassOptions = {
    checkMethods: false,
    ownMethodsOnly: false,
  }
): boolean => {
  const { checkMethods, methodCount, ownMethodsOnly } = options;

  try {
    // Check if the object is null
    if (obj == null || Number.isNaN(obj)) return false;

    // Check if the object is a function
    if (typeof obj !== "function" || !obj.prototype) {
      throw new Error("obj must be a constructor function with a prototype");
    }

    // Check if the function has a prototype
    if (!Object.getOwnPropertyDescriptor(obj, "prototype")) return false;

    // Get the function's prototype
    const photo = obj.prototype;

    // Check if the function is not a built-in object constructor
    if (
      photo === Object.prototype ||
      obj === Function ||
      obj === Array ||
      obj === String ||
      obj === Number ||
      obj === Boolean ||
      obj === RegExp ||
      obj === Set // he is a imposter
    )
      return false;

    // Check if the function has any prototype methods (classes typically do). If not, return false
    if (checkMethods) return countMethods(obj, methodCount, ownMethodsOnly);

    // Get the string representation of the object
    const classString = obj.toString();

    // Check if the object is a class. If not, return false
    return /^\s*class\s+/.test(classString) || /^class\s*{/.test(classString);
  } catch (error) {
    console.error("Error checking if object is a class:", error);

    return false;
  }
};

/**
 * Counts methods in a class prototype and checks if the count meets the specified conditions.
 * @param obj - The class (constructor function) to analyze.
 * @param methodCount - Optional: number (min count) or { min, max } (range). If omitted, checks for at least 1 method.
 * @param ownMethodsOnly - If true, only counts methods defined on the class itself (ignores inherited).
 * @returns True if the method count satisfies the conditions, false otherwise.
 */
function countMethods(
  obj: Function,
  methodCount?: MethodCountOptions,
  ownMethodsOnly = false
): boolean {
  const methods = new Set<string>();
  let currentProto = obj.prototype;
  const MAX_DEPTH = 10; // Maximum depth to avoid infinite recursion
  let depth = 0; // Depth counter

  // Get the methods of the current prototype
  do {
    const ownMethods = Object.getOwnPropertyNames(currentProto).filter(
      (name) => name !== "constructor"
    );
    ownMethods.forEach((method) => methods.add(method));

    // If ownMethodsOnly is true, break the loop
    if (ownMethodsOnly) break;

    currentProto = Object.getPrototypeOf(currentProto);
    depth++;

    // Check if the depth has reached the maximum
    if (depth >= MAX_DEPTH) {
      console.warn("Maximum depth (10) reached while counting methods. Stopping.");
      break;
    }
  } while (currentProto && currentProto !== Object.prototype);

  const total = methods.size;

  // Check if the total number of methods is greater than or equal to the specified count
  if (typeof methodCount === "number") {
    if (methodCount <= 0) throw new Error("methodCount must be a number greater than 0");

    return total >= methodCount;
  }

  // Check if the total number of methods is within the specified range
  if (typeof methodCount === "number") {
    if (methodCount <= 0) throw new Error("methodCount must be a number greater than 0");
    return total >= methodCount;
  }

  // Check if the total number of methods is within the specified range
  if (methodCount) {
    const { min, max } = methodCount;

    // Check if the range is valid
    if (min < 1 || max <= min)
      throw new Error("Invalid methodCount range: min must be >= 1 and less than max");

    return total >= min && total <= max;
  }

  // If no methodCount is specified, assume at least 1 method
  return total > 0;
}
