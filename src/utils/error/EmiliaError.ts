import { Abstract, type Enums } from "@constants";
import { Formatters } from "@utils";

class EmiliaError {
  /**
   * Creates a custom error with code, type, and timestamp
   * @param message - Error message
   * @param code - Error code from ErrorCode enum
   * @param errorType - Error type (optional)
   * @param getTime - Time formatter (optional)
   */
  public createError(
    message: string,
    code: Enums.ErrorCode, // required argument
    errorType?: string,
    getTime?: () => string,
  ): Abstract.AbstractEmiliaError {
    return new (class extends Abstract.AbstractEmiliaError {
      constructor(message: string) {
        super(message, code, getTime ?? Formatters.time);
        this.errorType = errorType ?? "Error";
      }
    })(message);
  }
}

/**
 * Singleton instance of EmiliaError
 * @param {string} message - Error message
 * @param {Enums.ErrorCode} - Error code
 * @param {string} [errorType] - Error type
 * @param {() => string} [getTime] - Function to get the time
 * @returns {EmiliaAbstractError} - Error object
 */
export const emiliaError = new EmiliaError().createError;
