import { ErrorCode } from "@enum/errorCode";
import { LogType } from "@enum/log";
import type { ArrayNotEmpty, LineType } from "@type";
import type { ClassWithJSONWriter, Result } from "@type/utils";
import type {
  FormattedLogText,
  FormatterLogOption,
  FormattingConsoleOptions,
  formatterTypeOption,
} from "@type/utils/logFormatter";
import { isObject } from "@utils/checkers/isObject";
//import { logCaller } from "@utils/decorators/logCaller";
import { setType } from "@utils/helpers/setType";

export class LogFormatter {
  public static readonly logCategories: ArrayNotEmpty<string> = [
    "utils",
    "formatters",
  ];

  /**
   * Formats a log message with the given text, type and categories.
   * @param {FormatterLogOption} options - Options for formatting the log message.
   * @param {unknown} options.text - The text to log. Can be an object or a string.
   * @param {string} options.type - The type of the log. I.e. 'info', 'error', 'warning', 'debug' or 'test'.
   * @param {string[]} options.categories - The categories of the log. I.e. 'global', 'database' or any other category.
   * @param {boolean} [options.date=false] - If true, adds the date to the log message with date and time with `dateAndTime()`. If false or undefined, only adds the time with `time()`.
   * @param {(...args: unknown[]) => string} [options.processingLine] - A function to process the log message before logging.
   * @returns {string} The formatted log message as a string.
   * @returns {Result<string>} The formatted log message as a Result object.
   */
  static formatterLog({
    text,
    type,
    categories,
    tags = [],
    metadata = {},
    context = {},
    date = false,
    processingLine,
    errorCode,
    jsonWriter
  }: FormatterLogOption & ClassWithJSONWriter): Result<string> {
    if (!jsonWriter || !text || !type || !categories || !errorCode) return {
      success: false,
      error: {
        code: ErrorCode.INVALID_PARAMETER,
        message: "Required parameters are missing: jsonWriter, text, type, categories, or errorCode"
      }
    };

    // Editing type if it is not a string
    const typeResult = this.processLogType(type);

    // Send Error, if have error
    if (!typeResult.success) return typeResult;

    // log formatting
    return jsonWriter.stringify({
      text: this.processLogText(text, processingLine),
      type: typeResult.data,
      categories,
      tags,
      metadata,
      context,
      errorCode,
      timestamp: date ? dateAndTime() : time(),
    });
  }

  /**
   * Processes the type of log and leads it to the string format
   * @private
   */
  private static processLogType(type: formatterTypeOption): Result<string> {
    if (typeof type === "string") return { success: true, data: type };

    const typeResult = this.formatterType(type);
    return typeResult.success
      ? { success: true, data: typeResult.data.toString() }
      : typeResult;
  }

  /**
   * Processes the text of the log, taking into account the processing function
   * @private
   */
  private static processLogText(text: unknown, processingLine?: (text: unknown) => string): string {
    return processingLine ? processingLine(text) : String(text);
  }

  /**
 * Converts a log type value to a standardized TypeLog format
 * @param {formatterTypeOption} type - Type of log (string, number, or TypeLog)
 * @returns {Result<TypeLog>} Result object with the converted TypeLog or an error
 * @example
 * ```ts
 * formatterType(1); // { success: true, data: "info" }
 * formatterType(5); // { success: true, data: "test" }
 * formatterType(0); // { success: false, error: { message: "Unknown log type: 0", code: ErrorCode.INVALID_TYPE } }
 * formatterType("info"); // { success: true, data: "info" }
 * ```
 */
  // @logCaller()
  static formatterType(type: formatterTypeOption): Result<LogType> {
    // If the type is already a string, validate it's a valid LogType value
    if (typeof type !== "number") {
      const validLogTypes = Object.values(LogType);

      if (validLogTypes.includes(setType<LogType>(type)))
        return { success: true, data: type };
    }

    // If a number is provided, convert it using a map
    const typeMap: Record<number, LogType> = {
      1: LogType.Info,
      2: LogType.Error,
      3: LogType.Warning,
      4: LogType.Debug,
    };

    if (typeof type === "number" && typeMap[type])
      return { success: true, data: typeMap[type] };

    return {
      success: false,
      error: {
        message: `Unknown log type: ${type}`,
        code: ErrorCode.INVALID_TYPE,
      },
    };
  }

  /**
   * Formats and logs a console message with the given parameters.
   *
   * @param {FormattingConsoleOptions} params - The parameters for formatting and logging.
   * @param {unknown} params.message - The log message. Can be an object or a string.
   * @param {LineType} params.line - The line type for formatting the log message.
   * @param {TypeLog} params.type - The type of the log.
   * @param {string[]} params.categories - The categories of the log.
   * @param {boolean} [params.event] - Whether to format the log as an event. Default is `false`.
   * @param {boolean} [params.logs] - Whether to log the formatted message. Default is `true`.
   * @param {() => string} [params.getTime=time] - A function to get the current time. Default is the `time` function from the `@utils` module.
   *
   * @returns {void}
   */
  static formattingConsole({
    message,
    line,
    type,
    categories,
    event,
    errorCode,
    logs,
    getTime = time,
  }: FormattingConsoleOptions): void {
    const logText = this.formatLogText(message);
    const editText = this.formatEventText(logText.in, event, type);

    if (logs)
      console.log(
        line.news,
        {
          time: getTime(),
          message: editText,
          errorCode,
          categories,
          type: typeof type === "number" ? this.formatterType(type) : type,
        },
        logText.out,
        line.last,
      );
  }

  /**
   * Formats the log text based on the message type.
   * @param {unknown} message - The log message.
   * @returns {object} - Formatted log text.
   */
  private static formatLogText(message: unknown): FormattedLogText {
    return {
      in: isObject(message) ? JSON.stringify(message) : String(message),
      out: isObject(message) ? message : ''
    };
  }

  /**
   * Formats the event text by removing the prefix if necessary.
   * @param {string} text - The log text.
   * @param {boolean | undefined} event - Whether to format the log as an event.
   * @param {LogType} type - The type of the log.
   * @returns {string} - Formatted event text.
   */
  private static formatEventText(
    text: string,
    event?: boolean,
    type?: LogType,
  ): string {
    if (event && text.length > 0 && type !== "error") {
      const splits = text.split(":");

      if (splits.length > 0) {
        return text.slice(splits[0].length + 2);
      }
    }

    return text;
  }

  /**
   * Method for formatting a line of a log message.
   * @param {number} inline - Inline type. 0 - No change, 1 - wrap from top to bottom, 2 - from bottom, 3 - both.
   * @returns {LineType} - Object with "news" and "last" properties, which are strings. "news" is used for start of line, "last" is used for end of line
   * @example
   * formattingLine(1); // {news: "\n", last: ""}
   * formattingLine(2); // {news: "", last: "\n"}
   * formattingLine(3); // {news: "\n", last: "\n"}
   */
  static formattingLineType(inline: number): LineType {
    return {
      news: inline === 1 || inline === 3 ? "\n" : "",
      last: inline === 2 || inline === 3 ? "\n" : "",
    };
  }
}

import { dateAndTime, time } from "./timeAndDate";
