import { AbstractLogger } from "@constants/abstract/AbstractLogger";
import { LogType } from "@constants/enum/log";
import type { LoggerConsoleData } from "@type/constants/logger";
import type { ILogFormatters } from "@type/utils/logFormatter";

/**
 * This class is used to log messages to the console.
 */
export class ConsoleLogger extends AbstractLogger {
  constructor(private readonly logFormatter: ILogFormatters) {
    super();
  }
  /**
   * Logs a message to the console with the specified log type.
   *
   * @param {LoggerConsoleData} message - The message to log.
   * @param {LogType} logType - The type of the log entry, such as info, error, or debug.
   * @param {boolean} [event=false] - Whether to format the log as an event. Default is `false`.
   * @returns {Promise<void>} A promise that resolves when the message is logged to the console.
   */
  async log(message: LoggerConsoleData, logType: LogType, event?: boolean): Promise<void> {
    this._consoleLog(message, logType, event);
  }

  /**
   * Logs a test message to the console.
   *
   * @param {LoggerConsoleData} message - The message to log.
   * @param {boolean} [event=false] - Whether to format the log as an event. Default is `false`.
   */
  async test(message: LoggerConsoleData, event?: boolean): Promise<void> {
    this._consoleLog(message, LogType.Test, event);
  }

  /**
   * Logs an info message to the console.
   *
   * @param {LoggerConsoleData} message - The message to log.
   * @param {boolean} [event=false] - Whether to format the log as an event. Default is `false`.
   */
  async info(message: LoggerConsoleData, event?: boolean): Promise<void> {
    this._consoleLog(message, LogType.Info, event);
  }

  /**
   * Logs an error message to the console.
   *
   * @param {LoggerConsoleData} message - The message to log.
   * @param {boolean} [event=false] - Whether to format the log as an event. Default is `false`.
   */
  async error(message: LoggerConsoleData, event?: boolean): Promise<void> {
    this._consoleLog(message, LogType.Error, event);
  }

  /**
   * Logs a warning message to the console.
   *
   * @param {LoggerConsoleData} message - The message to log.
   * @param {boolean} [event=false] - Whether to format the log as an event. Default is `false`.
   */
  async warning(message: LoggerConsoleData, event?: boolean): Promise<void> {
    this._consoleLog(message, LogType.Warning, event);
  }

  /**
   * Logs a debug message to the console.
   *
   * @param {LoggerConsoleData} message - The message to log.
   * @param {boolean} [event=false] - Whether to format the log as an event. Default is `false`.
   */
  async debug(message: LoggerConsoleData, event?: boolean): Promise<void> {
    this._consoleLog(message, LogType.Debug, event);
  }

  /**
   * Logs a message to the console.
   *
   * @param {LoggerConsoleData} message - The message to log.
   * @param {LogType} logType - The type of the log entry.
   * @param {boolean} [event=false] - Whether to format the log as an event. Default is `false`.
   * 
   * @private
   */
  private _consoleLog(message: LoggerConsoleData, logType: LogType, event?: boolean): void {
    this.logFormatter.formattingConsole({
      context: {},
      metadata: {},
      type: logType,
      message: message.text,
      line: this.logFormatter.formattingLineType(message.inline ?? 0),
      logs: true,
      event: event ?? false,
      ...message
    });
  }
}
