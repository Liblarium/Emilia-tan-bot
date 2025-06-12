import type { ErrorCode } from "@emilia-tan/config";
import { time } from "../format/timeAndDate";
import { EmiliaAbstractError } from "./emiliaAbstractError";

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
    code: ErrorCode, // required argument
    errorType?: string,
    getTime?: () => string
  ): EmiliaAbstractError {
    return new (class extends EmiliaAbstractError {
      constructor(message: string) {
        super(message, code, getTime ?? time);
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
