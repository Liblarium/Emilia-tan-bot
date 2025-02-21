import { Enums } from "@constants";
import type { ArrayNotEmpty } from "@type";
import type { LineType, TypeLog } from "@type/constants/log";
import type {
  FormatterLogOption,
  FormattingConsoleOptions,
} from "@type/utils/logFormatter";
import { Checkers, Decorators, Formatters, emiliaError } from "@utils";

export class LogFormatter {
  static readonly logCategories: ArrayNotEmpty<string> = [
    "utils",
    "formatters",
  ];

  /**
   * Formats a log message with the given text, type and category.
   * @param {FormatterLogOption} options - Options for formatting the log message.
   * @param {unknown} options.text - The text to log. Can be an object or a string.
   * @param {string} options.type - The type of the log. I.e. 'info', 'error', 'warning', 'debug' or 'test'.
   * @param {string} options.category - The category of the log. I.e. 'global', 'database' or any other category.
   * @param {boolean} [options.date=false] - If true, adds the date to the log message with date and time with `dateAndTime()`. If false or undefined, only adds the time with `time()`.
   * @param {(...args: unknown[]) => string} [options.processingLine] - A function to process the log message before logging.
   * @returns {string} The formatted log message as a string.
   */
  static formatterLog({
    text,
    type,
    category,
    date = false,
    processingLine,
  }: FormatterLogOption): string {
    const formattedText = Checkers.isObject(text)
      ? ObjectToString(text)
      : typeof text === "string"
        ? text
        : String(text);
    const result = `[${date ? Formatters.dateAndTime() : Formatters.time()}][${category.toUpperCase()} | ${type}]: ${formattedText}\n`;

    return processingLine ? processingLine(result) : result;
  }

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
  @Decorators.logCaller()
  static formatterType(type: (TypeLog & number) | string): TypeLog | undefined {
    // If the type is already a string and matches one of the allowed values:
    if (
      typeof type === "string" &&
      Object.values(Enums.LogType).includes(type as Enums.LogType)
    ) {
      return type as TypeLog;
    }

    // To avoid repeating Enums.LogType every time
    const { LogType } = Enums;

    // If a number is provided, you can convert it using a map:
    const typeMap: Record<number, TypeLog> = {
      1: LogType.Info,
      2: LogType.Error,
      3: LogType.Warning,
      4: LogType.Debug,
      5: LogType.Test,
    };

    if (typeof type === "number" && typeMap[type]) return typeMap[type];

    throw emiliaError(`Невідомий тип логу: ${type}`, "TypeError");
  }

  /**
   * Formats and logs a console message with the given parameters.
   *
   * @param {FormattingConsoleOptions} params - The parameters for formatting and logging.
   * @param {unknown} params.message - The log message. Can be an object or a string.
   * @param {LineType} params.line - The line type for formatting the log message.
   * @param {TypeLog} params.type - The type of the log.
   * @param {string} params.category - The category of the log.
   * @param {boolean} [params.event] - Whether to format the log as an event. Default is `false`.
   * @param {boolean} [params.logs] - Whether to log the formatted message. Default is `true`.
   * @param {() => string} [params.getTime=Formatters.time] - A function to get the current time. Default is the `time` function from the `@utils` module.
   *
   * @returns {void}
   */
  static formattingConsole({
    message,
    line,
    type,
    category,
    event,
    logs,
    getTime = Formatters.time,
  }: FormattingConsoleOptions): void {
    const logText = this.formatLogText(message);
    const editText = this.formatEventText(logText.in, event, type);

    if (logs)
      console.log(
        `${line.news}[${getTime()}][${category} | ${typeof type === "number" ? this.formatterType(type) : type}]: ${editText}`,
        logText.out,
        line.last,
      );
  }

  /**
   * Formats the log text based on the message type.
   * @param {unknown} message - The log message.
   * @returns {object} - Formatted log text.
   */
  private static formatLogText(message: unknown): { in: string; out: unknown } {
    return {
      in: Checkers.isObject(message)
        ? ""
        : typeof message === "string"
          ? message
          : String(message),
      out: Checkers.isObject(message) ? message : "",
    };
  }

  /**
   * Formats the event text by removing the prefix if necessary.
   * @param {string} text - The log text.
   * @param {boolean | undefined} event - Whether to format the log as an event.
   * @param {TypeLog} type - The type of the log.
   * @returns {string} - Formatted event text.
   */
  private static formatEventText(
    text: string,
    event?: boolean,
    type?: TypeLog,
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

function ObjectToString(context: object) {
  throw new Error("Function not implemented.");
}
