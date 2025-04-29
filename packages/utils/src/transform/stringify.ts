import { ErrorCode } from "@emilia-tan/types";
import { emiliaError } from "../core/emiliaError";
import type { Result } from "../types";

/**
 * Converts a JSON string to an object.
 * @param jsonString - The JSON string to convert.
 * @template T - The type of the object. (optional)
 * @returns The object represented by the JSON string. Or null if the JSON string is invalid.
 */
export function objectFromString<T = unknown>(jsonString: string): Result<T> {
  try {
    return { success: true, data: JSON.parse(jsonString) };
  } catch (error) {
    emiliaError(
      "Error parsing JSON string!",
      ErrorCode.JSON_PARSE_ERROR,
      "TypeError"
    );
    console.error(error);

    return {
      success: false,
      error: {
        code: ErrorCode.JSON_PARSE_ERROR,
        message: "Error parsing JSON string! Invalid input data",
      },
    };
  }
}
