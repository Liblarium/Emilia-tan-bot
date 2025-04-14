import type { ComponentError, ComponentPosition } from '@type';
import { ErrorCode } from '@enum/errorCode';

/**
 * Checks if the given component position is valid.
 *
 * @param position - The component position to check
 *
 * @returns The error if the position is invalid, otherwise null
 */
export function validateComponentPosition(
  position: ComponentPosition
): ComponentError | null {
  const { row, index } = position;

  if (typeof row !== 'number') {
    return {
      code: ErrorCode.INVALID_TYPE,
      message: 'Номер строки должен быть числом'
    };
  }

  if (row < 0 || row >= 5) {
    return {
      code: ErrorCode.OUT_OF_RANGE,
      message: 'Номер строки должен быть от 0 до 4'
    };
  }

  if (index !== undefined) {
    if (typeof index !== 'number') {
      return {
        code: ErrorCode.INVALID_TYPE,
        message: 'Индекс компонента должен быть числом'
      };
    }

    if (index < 0 || index >= 5) {
      return {
        code: ErrorCode.OUT_OF_RANGE,
        message: 'Индекс компонента должен быть от 0 до 4'
      };
    }
  }

  return null;
}