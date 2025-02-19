import { emiliaError } from "@utils";

/**
 * Converts an object to a formatted JSON string.
 * @param obj - The object to convert.
 * @returns The formatted JSON string.
 */
export function objectToString(obj: object): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    emiliaError("Error converting object to JSON string!", "TypeError");
    console.error(error);

    return '';
  }
}