import type { Enums } from '@constants';
import type { LineType, TypeLog } from "@type/constants/log";

/**
 * Formats a log message with the given text, type and category.
 */
export interface FormatterLogOption {
  /**
   * The text to log. Can be an object or a string.
   */
  text: unknown;
  /**
   * The type of the log. I.e. 'info', 'error', 'warning', 'debug' or 'test'.
   */
  type: string;
  /**
   * The category of the log. I.e. 'global', 'database' or any other category.
   */
  categories: string[];
  /**
   * If true, adds the date to the log message with date and time with `dateAndTime()`. If false or undefined, only adds the time with `time()`.
   * @default false
   */
  date?: boolean;
  /**
   * The tags to add to the log message.
   */
  tags: string[];
  /**
   * The error code to add to the log message.
   */
  errorCode: Enums.ErrorCode;
  /**
   * The metadata to add to the log message.
   */
  metadata: object;
  /**
   * The context to add to the log message.
   */
  context: object;
  /**
   * If specified, calls this function to process the log line before writing it
   * to the console. It takes the arguments that are passed to console.log as
   * an array and returns the processed string.
   *
   * @param args Yours arguments
   * @default undefined
   */
  processingLine?: (...args: unknown[]) => string;
};

/**
 * Formats and logs a console message with the given parameters.
 */
export interface FormattingConsoleOptions {
  /**
   * The parameters for formatting and logging.
   */
  message: unknown;
  /**
   * The line type for formatting the log message.
   */
  line: LineType;
  /**
   * The type of the log.
   */
  type: TypeLog;
  /**
   * The category of the log.
   */
  category: string;
  /**
   * Whether to log the formatted message.
   * @default true
   */
  logs?: boolean;
  /**
   * Whether to format the log as an event.
   * @default false
   */
  event?: boolean;
  /**
   * A function to get the current time. Default is the `time` function from the `@utils` module.
   * @returns {string} The current time
   */
  getTime?: () => string;
}
