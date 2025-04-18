import { AbstractLogger } from "@abstract/AbstractLogger";
import { LogType } from "@enum/log";
import type { LoggerData, PinoLogLevel } from "@type";
import type pino from "pino";

export abstract class AbstractPinoLogger extends AbstractLogger {
  protected readonly logger: pino.Logger;

  /**
   * Creates a new instance of AbstractPinoLogger
   * @param {pino.Logger} logger - The Pino logger instance to use
   */
  constructor(logger: pino.Logger) {
    super();
    this.logger = logger;
  }

  /**
   * Maps the given LogType to the corresponding PinoLogLevel
   * @param {LogType} type - The LogType to map
   * @returns {PinoLogLevel} The corresponding PinoLogLevel
   * @private
   */
  protected _mapLogLevel(type: LogType): PinoLogLevel {
    switch (type) {
      case LogType.Info:
        return "info";
      case LogType.Error:
        return "error";
      case LogType.Warning:
        return "warn";
      case LogType.Debug:
        return "debug";
      default:
        return "info";
    }
  }

  /**
   * Formats the log data to the format expected by Pino
   * @param message - The log data to format
   * @returns The formatted log data
   */
  protected _formatLogData(message: LoggerData) {
    return {
      msg: message.text,
      categories: message.categories,
      tags: message.tags,
      metadata: message.metadata ?? {},
      context: message.context ?? {},
      errorCode: message.errorCode,
      timestamp: new Date().toLocaleString('ru-RU', {
        timeZone: 'Europe/Kiev'
      })
    };
  }

  /**
   * Logs the given log data using the given log type
   * @param {LoggerData} message - The log data to log
   * @param {LogType} typeLog - The type of the log
   * @returns {Promise<void>} The promise of the log operation
   */
  async log(message: LoggerData, typeLog: LogType): Promise<void> {
    const level = this._mapLogLevel(typeLog);
    this.logger[level](this._formatLogData(message));
  }

  /**
   * Logs the given log data as an info type
   * @param {LoggerData} message - The log data to log
   * @returns {Promise<void>} The promise of the log operation
   */
  async info(message: LoggerData): Promise<void> {
    return this.log(message, LogType.Info);
  }

  /**
   * Logs the given log data as an error type
   * @param {LoggerData} message - The log data to log
   * @returns {Promise<void>} The promise of the log operation
   */
  async error(message: LoggerData): Promise<void> {
    return this.log(message, LogType.Error);
  }

  /**
   * Logs the given log data as a debug type
   * @param {LoggerData} message - The log data to log
   * @returns {Promise<void>} The promise of the log operation
   */
  async debug(message: LoggerData): Promise<void> {
    return this.log(message, LogType.Debug);
  }

  /**
   * Logs the given log data as a warning type
   * @param {LoggerData} message - The log data to log
   * @returns {Promise<void>} The promise of the log operation
   */
  async warning(message: LoggerData): Promise<void> {
    return this.log(message, LogType.Warning);
  }
}