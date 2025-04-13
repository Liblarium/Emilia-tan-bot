import { PrimitiveType } from "@enum/ValidationEnums";
import type {
  ArrayTypeCheck,
  ObjectTypeCheck,
  TypeCheck,
  ValidationError,
  ValidationOptions,
  ValidationResult,
} from "@type";
import { setType } from "@utils/helpers/setType";

/**
 * Marks a type check as optional.
 * If the value is null or undefined, defaultValue is returned instead of an error.
 * @param check - The type check to mark as optional.
 * @param defaultValue - The default value to return if the value is null or undefined.
 * @returns The marked type check.
 */
export function optional<T extends TypeCheck>(
  check: T,
  defaultValue?: unknown,
): { optional: true; check: T; defaultValue?: unknown } {
  return { optional: true, check, defaultValue };
}

/**
 * Creates a type check for an array of elements.
 * The type check returned by this function can be used as a value for the `type` property of a type check object.
 * @param elementCheck - The type check for the elements of the array.
 * @returns The type check object.
 */
export function arrayOf(elementCheck: TypeCheck): {
  type: "array";
  elementCheck: TypeCheck;
} {
  return { type: "array", elementCheck };
}

/**
 * Checks if the given value is an object with a `type` property.
 * @param check - The value to check.
 * @returns true if the value is an object with a `type` property, false otherwise.
 */
export function isTypeCheckObject(check: unknown): check is { type: string } {
  return typeof check === "object" && check !== null && "type" in check;
}

export function isArrayTypeCheck<T>(check: unknown): check is ArrayTypeCheck<T> {
  return isTypeCheckObject(check) && check.type === "array";
}

export function isObjectTypeCheck<T extends object>(
  check: unknown,
): check is ObjectTypeCheck<T> {
  return isTypeCheckObject(check) && check.type === "object";
}

// Базовые функции валидации
export function validatePrimitive(
  value: unknown,
  type: PrimitiveType,
  options: ValidationOptions = {},
): boolean {
  return value == null ? (options.nullable ?? false) : typeof value === type;
}

// Проверка свойств объекта
export function validatePropInObj(
  obj: object,
  prop: string,
): obj is { prop: string } {
  return prop in obj;
}

// Проверка null/undefined
export function isValueDefined<T extends object>(
  value: unknown,
): value is T[keyof T] {
  return value != null;
}

// Создание ошибок
export function createError(
  path: string,
  expected: string,
  received: unknown,
  message?: string,
): ValidationError {
  return {
    path,
    expected,
    received: typeof received,
    message: message ?? `Expected ${expected} at ${path}`,
  };
}

// Валидация массивов
export async function validateArray<T>(
  value: T,
  check: TypeCheck,
  options: ValidationOptions = {},
): Promise<ValidationResult> {
  if (!Array.isArray(value))
    return {
      isValid: false,
      errors: [
        createError(
          options.path ?? "",
          "array",
          typeof value,
          `Expected array at path '${options.path ?? ""}'`,
        ),
      ],
    };

  if (!check) return { isValid: true, errors: [] };

  if (typeof check === "function") {
    const validationErrors = value.reduce<ValidationError[]>(
      (acc, element, index) => {
        const elementPath = options.path
          ? `${options.path}[${index}]`
          : `[${index}]`;

        if (!check(element, { ...options, path: elementPath })) {
          acc.push(
            createError(
              elementPath,
              check.name || "custom validation",
              typeof element,
              `Custom validation failed at ${elementPath}`,
            ),
          );
        }

        return acc;
      },
      [],
    );

    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors,
    };
  }

  const validationErrors = value.reduce<ValidationError[]>(
    (acc, element, index) => {
      const elementPath = options.path
        ? `${options.path}[${index}]`
        : `[${index}]`;

      if (typeof check === "string" && !validatePrimitive(element, check)) {
        acc.push(
          createError(
            elementPath,
            check,
            typeof element,
            `Expected ${typeof check === "string" ? check : JSON.stringify(check)} at ${elementPath}`,
          ),
        );
      }

      return acc;
    },
    [],
  );

  return {
    isValid: validationErrors.length === 0,
    errors: validationErrors,
  };
}

// Валидация объектов
export async function validateObject<T extends object>(
  value: T,
  checks: Record<string, TypeCheck>,
  options: ValidationOptions = {},
): Promise<ValidationResult> {
  if (typeof value !== "object" || value === null)
    return {
      isValid: false,
      errors: [
        createError(
          options.path ?? "",
          "object",
          typeof value,
          `Expected object at path '${options.path ?? ""}'`,
        ),
      ],
    };

  const errors: ValidationError[] = [];

  for (const [key, check] of Object.entries(checks)) {
    const propertyPath = options.path ? `${options.path}.${key}` : key;
    const propertyValue = (setType<Record<string, unknown>>(value))[key];

    // Add functions-validators
    if (typeof check === "function") {
      if (!check(propertyValue)) {
        errors.push(
          createError(
            propertyPath,
            check.name || "custom validation",
            typeof propertyValue,
            `Validation failed at ${propertyPath}`,
          ),
        );
      }

      continue;
    }

    // Support for invested objects
    if (
      isTypeCheckObject(check) &&
      check.type === "object" &&
      "checks" in check &&
      typeof check.checks === "object" &&
      check.checks !== null
    ) {
      const nestedResult = await validateObject<T>(
        setType<T>(propertyValue),
        check.checks as Record<string, TypeCheck>,
        { ...options, path: propertyPath },
      );

      errors.push(...nestedResult.errors);
    }

    // Существующая проверка примитивов
    if (typeof check !== "function" && typeof check !== "object" && !validatePrimitive(propertyValue, check)) {
      errors.push(
        createError(
          propertyPath,
          check,
          typeof propertyValue,
          `Expected ${typeof check === "string" ? check : JSON.stringify(check)} at ${propertyPath}`,
        ),
      );
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Checks if the given value is not null or undefined.
 * If the value is not null or undefined, the function returns true.
 * Otherwise, it returns false.
 * @param value - The value to check.
 * @returns true if the value is not null or undefined, false otherwise.
 */
export function validateValueIsNotNull<T extends object>(
  value: unknown,
): value is T[keyof T] {
  return value != null;
}

/**
 * Validates a value against a simple type check.
 * If the type check is a PrimitiveType string, the value is validated against that type.
 * If the type check is a function, the value is validated by calling the function with the value.
 * If the validation fails, an error is added to the errors array.
 * @param prop - The property name of the value to validate.
 * @param value - The value to validate.
 * @param typeCheck - The type check.
 * @param errors - The array of errors to add any new errors to.
 * @returns A promise that resolves to true if the validation succeeds, false otherwise.
 */
export async function validateSimpleTypes(
  prop: string,
  value: unknown,
  typeCheck: TypeCheck,
  errors: ValidationError[],
) {
  if (
    typeof typeCheck === "string" &&
    Object.values(PrimitiveType).includes(typeCheck) &&
    !validatePrimitive(value, typeCheck)
  ) {
    errors.push(createError(prop, typeCheck, value));

    return false;
  }

  if (
    typeof typeCheck === "function" &&
    !(await Promise.resolve(typeCheck(value)))
  ) {
    errors.push(createError(prop, "custom validation", value));

    return false;
  }

  return true;
}
