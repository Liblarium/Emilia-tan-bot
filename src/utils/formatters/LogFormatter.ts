import { LogType } from "@constants/enum/log";
import { inspect } from "node:util";
import { emiliaError } from "../error/EmiliaError";
import { LineType, TypeLog } from "@type/constants/log";
import { time, dateAndTime } from "@utils";

export class LogFormatter {

  /**
   * Formats a log message with the given text, type and category.
   * @param {unknown} text - The text to log. Can be an object or a string.
   * @param {string} type - The type of the log. I.e. 'info', 'error', 'warning', 'debug' or 'test'.
   * @param {string} category - The category of the log. I.e. 'global', 'database' or any other category.
   * @param {boolean} [date=false] - If true, adds the date to the log message with date and time with `dateAndTime()`. If false or undefined, only adds the time with `time()`.
   * @returns {string} The formatted log message as a string.
   */
  static formatterLog(text: unknown, type: string, category: string, date?: boolean): string {
    const formattedText = typeof text === "object" ? inspect(text) : String(text);
    return `[${date ? dateAndTime() : time()}][${category.toUpperCase()} | ${type}]: ${formattedText}\n`;
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
  static formatterType(type: TypeLog & number | string): TypeLog | undefined {
    // Якщо тип уже є рядком і відповідає одному з допустимих значень:
    if (typeof type === "string" && Object.values(LogType).includes(type as LogType)) {
      return type as TypeLog;
    }

    // Якщо надається число, можна зробити перетворення за допомогою мапи:
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
   * @param {object} params - The parameters for formatting and logging.
   * @param {unknown} params.message - The log message. Can be an object or a string.
   * @param {LineType} params.line - The line type for formatting the log message.
   * @param {TypeLog} params.type - The type of the log.
   * @param {string} params.category - The category of the log.
   * @param {boolean} [params.event] - Whether to format the log as an event. Default is `false`.
   * @param {boolean} [params.logs] - Whether to log the formatted message. Default is `true`.
   * @param {() => string} [params.getTime] - A function to get the current time. Default is the `time` function from the `@utils` module.
   *
   * @returns {void}
   */
  static formattingConsole({ message, line, type, category, event, logs, getTime = time }: { message: unknown, line: LineType, type: TypeLog, category: string, logs?: boolean, event?: boolean, getTime?: () => string }): void {
    const logText = this.formatLogText(message);
    const editText = this.formatEventText(logText.in, event, type);

    if (logs) {
      console.log(`${line.news}[${getTime()}][${category} | ${typeof type === "number" ? type.toString() : type}]: ${editText}`, logText.out, line.last);
    }
  }


  /**
   * Formats the log text based on the message type.
   * @param {unknown} message - The log message.
   * @returns {object} - Formatted log text.
   */
  private static formatLogText(message: unknown): { in: string, out: unknown } {
    return {
      in: typeof message === "object" ? "" : typeof message === "string" ? message : `${message}`,
      out: typeof message === "object" ? message : "",
    };
  }

  /**
   * Formats the event text by removing the prefix if necessary.
   * @param {string} text - The log text.
   * @param {boolean | undefined} event - Whether to format the log as an event.
   * @param {TypeLog} type - The type of the log.
   * @returns {string} - Formatted event text.
   */
  private static formatEventText(text: string, event?: boolean, type?: TypeLog): string {
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