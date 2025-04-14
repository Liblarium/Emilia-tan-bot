import { hexToDecimal } from './convert';

/**
 * Replaces a color with another color if it is 0.
 *
 * @param {number|string} color - The color to replace. It can be a number or a hexadecimal string.
 * @param {number|string} replacedColor - The color to replace with. It can be a number or a hexadecimal string.
 * @returns {number} - The replaced color if the color is 0, or the original color if it is not 0.
 * @example
 * displayColor(0, "#FF0000"); // returns 16711680
 */
export function displayColor(
  color: number | string,
  replacedColor: number | string,
): number {
  if (typeof color === "string") color = hexToDecimal(color);
  if (typeof replacedColor === "string")
    replacedColor = hexToDecimal(replacedColor);

  return color === 0 ? replacedColor : color;
}