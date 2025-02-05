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
  After,
  /**
   * Inline after text
   */
  Before,
  /**
   * Inline before and after text
   */
  Both
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
  /**
   * Test log type
   */
  Test = "test",
}