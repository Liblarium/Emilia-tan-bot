/**
 * @file
 * @description This file exports all utility functions/Classes and decorators.
 */

/**
 * Formatters
 * 
 * Functions/Classes for formatting strings, text, time and dates
 */
export * as Formatters from "./formatters";

/**
 * Decorators
 * 
 * Decorators for some tools
 */
export * as Decorators from "./decorators";

/**
 * Error
 * 
 * Some error function (ErrorFactory)
 */
export { emiliaError } from "./error/EmiliaError";

/**
 * Transform
 * 
 * Functions/Classes for transforming values between types
 */
export * as Transforms from "./transform";

/**
 * Checkers
 * 
 * Functions/Classes for checking the type of a given value
 */
export * as Checkers from "./checkers";

/**
 * Managers
 * 
 * Functions/Classes from managers
 */
export * as Managers from "./managers";

/**
 * JSONs
 * 
 * Functions/Classes for working with JSON files
 */
export * as JSONs from "./json";

/**
 * I just don’t know how to “name them” correctly, so they will be in `Other`. 
 * 
 * Here are those utilities that I could not send to a certain group (new ones may be added)
 */
export * as Other from "./other";

