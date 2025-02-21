import { emiliaError } from "../error/EmiliaError";

/**
 * Converts a JSON string to an object.
 * @param jsonString - The JSON string to convert.
 * @template T - The type of the object. (optional)
 * @returns The object represented by the JSON string. Or null if the JSON string is invalid.
 */
export function objectFromString<T = unknown>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    emiliaError("Error parsing JSON string!", "TypeError");
    console.error(error);

    return null;
  }
}
