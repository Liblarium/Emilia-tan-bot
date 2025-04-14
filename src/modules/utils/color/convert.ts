/**
 * Converts a hexadecimal string to a decimal number.
 *
 * @param {string} hex - The hexadecimal string to convert. It can optionally start with "0x" or "#".
 * @returns {number} - The decimal number representation of the hexadecimal string.
 * @example
 * hexToDecimal("#FF0000"); // returns 16711680
 */
export function hexToDecimal(hex: string): number {
  const sliceNum = hex.startsWith("0x") ? 2 : hex.startsWith("#") ? 1 : 0;
  return Number.parseInt(hex.slice(sliceNum), 16);
}