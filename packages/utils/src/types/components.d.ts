import type { ErrorCode } from "@emilia-tan/config";

/**
 * Position of component. `row` is raw position (0-4), `index` is component position in row (0-4)
 */
export type ComponentPosition = {
  /**
   * Raw position (0-4)
   */
  row: number;
  /**
   * Component position in row (0-4)
   */
  index?: number;
};

/**
 * Error of component
 */
export type ComponentError = {
  /**
   * Error code
   */
  code: ErrorCode.INVALID_TYPE | ErrorCode.OUT_OF_RANGE | ErrorCode.MISSING_INTERACTION;
  message: string;
};

/**
 * Result of component
 * @template T - Data of component
 */
export type ComponentResult<T> = {
  /**
   * If the component is successful
   */
  success: boolean;
  /**
   * Data of component
   */
  data?: T;
  /**
   * Error of component
   */
  error?: ComponentError;
};
