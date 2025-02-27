import { Enums } from "@constants";
import type { Result } from "@type/utils";
import { emiliaError } from "@utils";

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
    emiliaError("Error parsing JSON string!", Enums.ErrorCode.JSON_PARSE_ERROR, "TypeError");
    console.error(error);

    return {
      success: false,
      error: { code: Enums.ErrorCode.JSON_PARSE_ERROR, message: "Error parsing JSON string! Invalid input data" },
    }
  }
}
