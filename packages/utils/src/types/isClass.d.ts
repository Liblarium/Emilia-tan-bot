/**
 * `MethodCountOptions` is a type that can be either a number or an object with a min and max property.
 */
export type MethodCountOptions = number | { min: number; max: number };

interface IsClassOptions {
  /** Check if class has methods (default: false) */
  checkMethods?: boolean;
  /** Requirements for number of methods */
  methodCount?: MethodCountOptions;
  /** Consider only own class methods (default: false) */
  ownMethodsOnly?: boolean;
}

export interface IisClass {
  /** 
   * Check if an object is a class.
   * @param {unknown} obj - The object to check.
   * @param {boolean} [methods=false] - Whether to check if the class has methods. Default is `false`. Is a strict check
   * @param {MethodCountOptions} [methodCount=1] - The minimum and maximum number of methods the class should have. Use `methods` & `methodCount` if you need a strict class check
   * @returns {boolean} Returns `true` if the object is a class, `false` otherwise.
   * @example
   * ```ts
   * class MyClass {}
   * isClass(MyClass); // true
   * isClass({}); // false
   * isClass(null); // false
   * ```
  */
  (obj: unknown, options?: IsClassOptions): boolean
}