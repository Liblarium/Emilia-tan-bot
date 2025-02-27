import { Enums } from "@constants";
import type { Result } from "@type/utils";
import { emiliaError } from "@utils";

/**
 * Converts an object to a formatted JSON string.
 * @param obj - The object to convert.
 * @param pretty - A boolean indicating whether to format the JSON string. Defaults to true.
 * @returns The formatted JSON string.
 */
export function objectToString(
  obj: object,
  pretty: boolean = true,
): Result<string> {
  try {
    return {
      success: true,
      data: JSON.stringify(obj, null, pretty ? 2 : undefined),
    };
  } catch (error) {
    emiliaError(
      "Error converting object to JSON string!",
      Enums.ErrorCode.INVALID_OBJECT,
      "TypeError",
    );

    console.error(error);

    return {
      success: false,
      error: {
        code: Enums.ErrorCode.INVALID_OBJECT,
        message: `Error converting object: ${error.message}`,
      },
    };
  }
}
