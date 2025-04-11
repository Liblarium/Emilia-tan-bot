import { ErrorMessages } from "@constants/enum/ValidationEnums";
import type { TypeCheck, ValidationError, ValidationResult } from "@type/utils/ValidationTypes";
import { setType } from "@utils/other/setType";
import { createError, isArrayTypeCheck, isObjectTypeCheck, validateArray, validateObject, validatePropInObj, validateSimpleTypes, validateValueIsNotNull } from "./validationUtils";

/**
 * Validates an object against a map of property type checks.
 * Each property of the object is validated based on the provided type checks.
 * Supports validation of primitive types, arrays, and nested objects.
 * If a property fails validation, an error is added to the errors array.
 *
 * @template T - The type of the object to validate
 * @param obj - The object to validate.
 * @param propTypeMap - A map of property names to their corresponding type checks.
 * @returns A promise that resolves to a ValidationResult indicating if the validation succeeded and any errors encountered.
 * @example
 * ```ts
 * const obj = {
 *   name: "John",
 *   age: 25,
 *   isActive: true
 * };
 * 
 * const result = await hasPropertiesWithTypes(obj, {
 *   name: PrimitiveType.String,
 *   age: PrimitiveType.Number,
 *   isActive: PrimitiveType.Boolean
 * });
 * 
 * console.log(result); // { isValid: true, errors: [] }
 * ```
 */

export async function hasPropertiesWithTypes<T extends object>(
  obj: T,
  propTypeMap: Partial<Record<keyof T, TypeCheck<T>>>,
): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  if (typeof obj !== "object" || obj === null) return {
    isValid: false,
    errors: [createError("", "object", obj)],
  };

  for await (const [prop, typeCheck] of Object.entries(propTypeMap)) {
    const value = obj[setType<keyof T>(prop)];
    const isNonNullValue = validateValueIsNotNull<T>(value);

    if (!validatePropInObj(obj, prop) && isNonNullValue) {
      const expected = isNonNullValue ? ErrorMessages.UndefinedProp : setType<string>(typeCheck);
      const received = isNonNullValue ? ErrorMessages.ValueNullable : value;

      errors.push(createError(prop, expected, received));

      continue;
    }

    try {
      // Проверка примитивных типов
      if (await validateSimpleTypes(prop, value, setType<TypeCheck<T>>(typeCheck), errors)) continue;

      // Проверка массивов
      if (isArrayTypeCheck<T>(typeCheck)) {
        const res = await validateArray(value, typeCheck, {
          path: prop,
          strict: typeCheck.strict,
          nullable: typeCheck.nullable,
        });

        if (!res.isValid) errors.push(...res.errors);

        continue;
      }

      // Проверка вложенных объектов
      if (isObjectTypeCheck<T>(typeCheck)) {
        await validateObject<T>(setType<T>(value), typeCheck.checks, {
          path: prop,
          strict: typeCheck.strict,
          nullable: typeCheck.nullable,
        });
      }
    } catch (error) {
      errors.push(createError(prop, ErrorMessages.Validation, `Error: ${error.message}`));
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}