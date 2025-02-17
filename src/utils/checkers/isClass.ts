/**
 * Check if object is a class
 * @param {unknown} obj - object to check
 * @returns {boolean} - true if class, false otherwise
 */
export const isClass = (obj: unknown): boolean => {
  if (typeof obj !== 'function') {
    return false;
  }

  // Check if the function has a prototype
  if (!obj.prototype) {
    return false;
  }

  // Check if the function name starts with an uppercase letter (convention for classes)
  if (!/^[A-Z]/.test(obj.name)) {
    return false;
  }

  // Check if the function is not a built-in object constructor
  if (obj === Object || obj === Function || obj === Array || obj === String || obj === Number || obj === Boolean) {
    return false;
  }

  // Check if the function has any prototype methods (classes typically do)
  if (Object.getOwnPropertyNames(obj.prototype).length <= 1) {
    return false;
  }

  // Check if the string representation contains 'class' keyword
  // This helps identify class declarations and expressions
  return /^\s*class\s+/.test(obj.toString()) || /^class\s*{/.test(obj.toString());
};