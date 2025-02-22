import { Enums } from "@constants";
import { emiliaError } from "@utils";

/**
 * Converts an object to a formatted JSON string.
 * @param obj - The object to convert.
 * @param pretty - A boolean indicating whether to format the JSON string.
 * @returns The formatted JSON string.
 */
export function objectToString(obj: object, pretty: boolean = true): string {
  try {
    return JSON.stringify(obj, null, pretty ? 2 : undefined);
  } catch (error) {
    emiliaError("Error converting object to JSON string!",
      Enums.ErrorCode.INVALID_OBJECT, "TypeError");
    console.error(error);

    return '';
  }
}