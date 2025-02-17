import { Abstract } from "@constants";
import { Formatters } from "@utils";

class EmiliaError {
  /**
   * Creates a new error of type EmiliaAbstractError
   * @param {string} message - Error message
   * @param {string} [errorType] - Error type
   * @param {() => string} [getTime] - Function to get the time
   * @returns {EmiliaAbstractError} - Error object
   */
  public createError(message: string, errorType?: string, getTime?: () => string): Abstract.EmiliaAbstractError {
    // Create a new anonymous class that extends EmiliaAbstractError
    return new (class extends Abstract.EmiliaAbstractError {
      // Constructor of the anonymous class
      constructor(message: string) {
        // Call the parent constructor with the message and either the provided getTime function or the default time function
        super(message, getTime ?? Formatters.time);
        // Set the errorType property of the class
        this.errorType = errorType ?? "Error";
      }
    })(message); // Instantiate the anonymous class with the provided message
  }
}
/**
 * Singleton instance of EmiliaError
 * @param {string} message - Error message
 * @param {string} [errorType] - Error type
 * @param {() => string} [getTime] - Function to get the time
 * @returns {EmiliaAbstractError} - Error object
 */
export const emiliaError = new EmiliaError().createError;