import { ErrorCode } from "@emilia-tan/config";
import { emiliaError } from "../core/emiliaError";
import { getErrorMessage } from "../core/getErrorMessage";
import type { Result } from "../types";

/**
 * Converts an object to a formatted JSON string.
 * @param obj - The object to convert.
 * @param pretty - A boolean indicating whether to format the JSON string. Defaults to true.
 * @returns The formatted JSON string.
 */
export function objectToString(obj: object, pretty: boolean = true): Result<string> {
  try {
    return {
      success: true,
      data: JSON.stringify(obj, null, pretty ? 2 : undefined),
    };
  } catch (error) {
    emiliaError("Error converting object to JSON string!", ErrorCode.INVALID_OBJECT, "TypeError");

    console.error(error);

    return {
      success: false,
      error: {
        code: ErrorCode.INVALID_OBJECT,
        message: `Error converting object: ${getErrorMessage(error)}`,
      },
    };
  }
}
