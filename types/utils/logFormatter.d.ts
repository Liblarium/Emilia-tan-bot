import type { ErrorCode } from "@constants/enum/errorCode";
import type { LogType } from "@constants/enum/log";
import type { LineType, TypeLog } from "@type/constants/log";
import type { Result } from "@type/utils";
import type { LogFormatter } from "@utils/formatters/LogFormatter";

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
  type: TypeLog;
  /**
   * The categories of the log. I.e. 'global', 'database' or any other category.
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
  errorCode: ErrorCode;
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
}

/**
 * Formats and logs a console message with the given parameters.
 */
export interface FormattingConsoleOptions {
  /**
   * The message to log. Can be an object or a string.
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
   * The categories of the log.
   */
  categories: string[];
  /**
   * Whether to log the formatted message.
   * @default true
   */
  logs?: boolean;
  /**
   * The error code to add to the log message.
   */
  errorCode: ErrorCode;
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

export type formatterTypeOption = (TypeLog | number) | string;

/**
 *
 * {@link Formatters.LogFormatter LogFormatter}
 *
 * {@link ILogFormatterStaticMethods static methods of LogFormatter types}
 */
export interface ILogFormatters
  extends ILogFormatterStaticMethods,
  LogFormatter { }

interface ILogFormatterStaticMethods {
  /**
   * Formats a log message with the given text, type and category.
   * @param {FormatterLogOption} options - Options for formatting the log message.
   * @param {unknown} options.text - The text to log. Can be an object or a string.
   * @param {string} options.type - The type of the log. I.e. 'info', 'error', 'warning', 'debug' or 'test'.
   * @param {string[]} options.categories - The categories of the log. I.e. 'global', 'database' or any other category.
   * @param {boolean} [options.date=false] - If true, adds the date to the log message with date and time with `dateAndTime()`. If false or undefined, only adds the time with `time()`.
   * @param {(...args: unknown[]) => string} [options.processingLine] - A function to process the log message before logging.
   * @returns {string} The formatted log message as a string.
   */
  formattingLineType(inline: number): LineType;
  /**
   * Method for change number value of type to string
   * @param {TypeLog | undefined | null} type - Type of log
   * @returns {void}
   * @throws {EmiliaTypeError} - If the type is not a number or is not within the range of TypeLog values
   * @example
   * setType(1); // "info"
   * setType(5); // "test"
   * setType(0); // EmiliaError: Невідомий тип логу: 0
   */
  formatterType(options: formatterTypeOption): Result<LogType>;
  /**
   * Formats a log message with the given text, type and category.
   * @param {FormatterLogOption} options - Options for formatting the log message.
   * @param {unknown} options.text - The text to log. Can be an object or a string.
   * @param {string} options.type - The type of the log. I.e. 'info', 'error', 'warning', 'debug' or 'test'.
   * @param {string[]} options.categories - The categories of the log. I.e. 'global', 'database' or any other category.
   * @param {boolean} [options.date=false] - If true, adds the date to the log message with date and time with `dateAndTime()`. If false or undefined, only adds the time with `time()`.
   * @param {(...args: unknown[]) => string} [options.processingLine] - A function to process the log message before logging.
   * @returns {string} The formatted log message as a string.
   */
  formatterLog(options: FormatterLogOption): Result<string>;
  /**
   * Formats and logs a console message with the given parameters.
   *
   * @param {FormattingConsoleOptions} params - The parameters for formatting and logging.
   * @param {unknown} params.message - The log message. Can be an object or a string.
   * @param {LineType} params.line - The line type for formatting the log message.
   * @param {TypeLog} params.type - The type of the log.
   * @param {string} params.categories - The categories of the log.
   * @param {boolean} [params.event] - Whether to format the log as an event. Default is `false`.
   * @param {boolean} [params.logs] - Whether to log the formatted message. Default is `true`.
   * @param {() => string} [params.getTime=Formatters.time] - A function to get the current time. Default is the `time` function from the `@utils` module.
   *
   * @returns {void}
   */
  formattingConsole(options: FormattingConsoleOptions): void;
}

export interface FormattedLogText {
  in: string;
  out: unknown;
}
