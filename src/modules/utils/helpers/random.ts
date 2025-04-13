import { ErrorCode } from "@enum/errorCode";
import { emiliaError } from "@utils/error/EmiliaError";

/**
 * Generate random number
 * @param {number} min - min number
 * @param {number} max - max number
 * @returns {number} - generated number
 * @throws {RangeError} - if min is greater than or equal to max
 * @example
 * random(1, 10); // returns a random number between 1 and 10. Example: 5
 */
export const random = (min: number, max: number): number => {
  if (min >= max) throw emiliaError(`Аргумент min (${min.toString()}) не может быть больше или равно аргументу max (${max.toString()})!`, ErrorCode.INVALID_DATA, "RangeError");

  const random = Math.floor(Math.random() * (max - min + 1)) + min;

  return random > max ? random - 1 : random;
};