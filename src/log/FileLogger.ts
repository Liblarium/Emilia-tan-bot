import { AbstractLogger } from "@constants/abstract/AbstractLogger";
import { ErrorCode } from "@constants/enum/errorCode";
import { LogType } from "@constants/enum/log";
import type { LoggerData } from "@type/constants/logger";
import type { Result } from "@type/utils";
import type { IJSONReader } from "@type/utils/jsonReader";
import type { IJSONWriter } from "@type/utils/jsonWriter";
import type { ILogFormatters } from "@type/utils/logFormatter";
import { emiliaError } from "@utils/error/EmiliaError";

/**
 * This class is used to log messages to the file on ".log" file.
 */
export class FileLogger extends AbstractLogger {
  /**
   * Constructs a new instance of the FileLogger.
   *
   * @param {string} filePath - The path to the log file where messages will be written.
   */

  constructor(
    private readonly filePath: string,
    private readonly jsonWriter: IJSONWriter,
    private readonly jsonReader: IJSONReader,
    private readonly logFormatter: ILogFormatters
  ) {
    super();

    this._checkDependencies();

    if (!filePath)
      throw emiliaError(
        "File path is required",
        ErrorCode.INVALID_PATH,
        "InternalError",
      );
  }

  private _checkDependencies(): void {
    if (!this.jsonWriter || !this.jsonReader || !this.logFormatter) {
      throw emiliaError(
        "Missing dependencies",
        ErrorCode.MISSING_DEPENDENCIES,
        "InternalError"
      );
    }
  }

  /**
   * Writes the given message to the log file.
   *
   * @param {LogEntry} message - The message to write.
   * @param {LogType} logType - The type of the log entry.
   * @returns {Promise<void>} A promise that resolves when the message is written to the log file.
   */
  async log(message: LoggerData, logType: LogType): Promise<void> {
    return await this._appendLog(message, logType);
  }

  /**
   * Writes the given message to the log file as an info message.
   *
   * @param {LogEntry} message - The message to write.
   */
  async info(message: LoggerData): Promise<void> {
    return await this._appendLog(message, LogType.Info);
  }

  /**
   * Writes the given message to the log file as an error message.
   *
   * @param {LogEntry} message - The message to write.
   */
  async error(message: LoggerData): Promise<void> {
    return await this._appendLog(message, LogType.Error);
  }

  /**
   * Writes the given message to the log file as a debug message.
   *
   * @param {LogEntry} message - The message to write.
   */
  async debug(message: LoggerData): Promise<void> {
    return await this._appendLog(message, LogType.Debug);
  }

  /**
   * Writes the given message to the log file as a warning message.
   *
   * @param {LogEntry} message - The message to write.
   */
  async warning(message: LoggerData): Promise<void> {
    return await this._appendLog(message, LogType.Warning);
  }

  async test(message: LoggerData): Promise<void> {
    return await this._appendLog(message, LogType.Test);
  }

  /**
   * Writes the given message to the log file.
   *
   * @param {string} message - The message to write.
   *
   * @returns {Promise<Result<void>>} The result of writing the message. If the write was successful, returns undefined. Otherwise, returns a Result object with an error message.
   */
  private async _logToFile(message: string): Promise<Result<void>> {
    return await this.jsonWriter.appendLine(
      this.filePath,
      this.jsonReader.parse<object>(message),
    );
  }

  /**
   * Writes the given log entry to the log file.
   *
   * @param {LogEntry} logEntry - The log entry to write.
   * @param {LogType} type - The type of the log entry.
   *
   * @returns {Promise<void>} The result of writing the log entry. If the write was successful, returns undefined. Otherwise, returns a Result object with an error message.
   */
  private async _appendLog(logEntry: LoggerData, type: LogType): Promise<void> {
    const editLogEntry = { metadata: {}, context: {}, type, ...logEntry };
    const formattedLog = this.logFormatter.formatterLog(editLogEntry);

    // If the formatting was successful, write the log to the file
    if (formattedLog.success) {
      const result = await this._logToFile(formattedLog.data);

      // If the write was successful, return undefined
      return result.success ? undefined : console.error(result.error);
    }

    // If the formatting was not successful, log the error
    return console.error(formattedLog.error);
  }
}
