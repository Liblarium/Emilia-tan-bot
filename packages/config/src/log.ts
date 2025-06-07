/**
 * Enum for inline mode
 */
export enum InlineType {
  /**
   * No inline
   */
  None = 0,
  /**
   * Inline before text
   */
  After = 1,
  /**
   * Inline after text
   */
  Before = 2,
  /**
   * Inline before and after text
   */
  Both = 3,
}

/**
 * Enum for log types
 * @readonly
 * @enum {string}
 * @example
 * LogType.Info; // "info"
 */
export enum LogType {
  /**
   * Information log type
   */
  Info = "info",
  /**
   * Error log type
   */
  Error = "error",
  /**
   * Warning log type
   */
  Warning = "warning",
  /**
   * Debug log type
   */
  Debug = "debug",
}
