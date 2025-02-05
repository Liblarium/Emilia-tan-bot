import { emiliaError } from "@utils";

/**
 * Convert a string to a BigInt.
 *
 * @param {string} str - The string to convert to a BigInt
 * @returns {bigint} - The BigInt representation of the input string
 * @throws {Error} - If the input string is not a valid BigInt
 * @throws {Error} - If the input string is empty
 */
export const stringToBigInt = (str: string): bigint => {
  if (typeof str !== "string")
    throw emiliaError("[utils.stringToBigInt]: str must be a string!", "SyntaxError");
  if (!str || str.length === 0)
    throw emiliaError("[utils.stringToBigInt]: str must not be empty!", "TypeError");

  return BigInt(str);
};