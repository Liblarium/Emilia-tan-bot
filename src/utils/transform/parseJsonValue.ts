import type { JsonValue } from "@prisma/client/runtime/library";

/**
 * Parse a JsonValue to a typed value.
 *
 * @remarks
 * This function is a cast of the JsonValue to the specified type.
 * It is up to the caller to ensure that the JsonValue is actually of the specified type.
 *
 * @template T - The type to parse the JsonValue to
 * @param {JsonValue} jsonValue - The JsonValue to parse
 * @returns {T} - The parsed JsonValue
 * @example
 * type Food = { // example type. You can replace this with your own type
 *   name: string;
 * }
 * 
 * const parsedValue: Food = parseJsonValue<Food>(jsonValue); // parsedValue will be of type Food
 */
export function parseJsonValue<T>(jsonValue: JsonValue): T {
  return jsonValue as T;
}