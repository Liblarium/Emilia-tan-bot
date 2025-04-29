/**
 * Generates a random integer between min and max (inclusive).
 * @param min - The lower bound.
 * @param max - The upper bound.
 * @returns A random integer between min and max.
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
