/**
 * Get the error message from an error object.
 *
 * @param {unknown} e - The error object to evaluate.
 * @returns {string} - The error message if the input is an Error instance, otherwise "Unknown error".
 */
export function getErrorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Unknown error";
}
