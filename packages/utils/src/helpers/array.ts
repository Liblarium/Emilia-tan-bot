/**
 * Removes duplicate elements from an array.
 * @template T - The type of elements in the array.
 * @param arr - The array from which duplicates should be removed.
 * @returns A new array containing only the unique elements from the original array.
 */

export function removeDuplicates<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
