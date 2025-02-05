
/**
 * Formatters
 * 
 * Functions for formatting strings, text, time and dates
 */
export { date, time, dateAndTime, logTime } from "./formatters/timeAndDate";
export { offNewLine } from "./formatters/offNewLine";
export { LogFormatter } from "./formatters/LogFormatter";

/**
 * Error
 * 
 * Some error category files
 */
export { emiliaError } from "./error/EmiliaError";

/**
 * Transform
 * 
 * Functions for transforming values between types
 */
export { stringToBigInt } from "./transform/stringToBigInt";
export { parseJsonValue } from "./transform/parseJsonValue";

/**
 * Checkers
 * 
 * Functions for checking the type of a given value
 */
export { isClass } from "./isClass";

/**
 * Random
 * 
 * Function a random values from a given range
 */
export { random } from "./random";

