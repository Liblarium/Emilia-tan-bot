import { AbstractLogger } from "@abstract/AbstractLogger";
import { LogType } from "@enum/log";
import type { LoggerData, PinoLogLevel } from "@type";
import type pino from "pino";

export abstract class BasePinoLogger extends AbstractLogger {
  protected readonly logger: pino.Logger;

  constructor(logger: pino.Logger) {
    super();
    this.logger = logger;
  }

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

  protected _formatLogData(message: LoggerData) {
    return {
      msg: message.text,
      categories: message.categories,
      tags: message.tags,
      metadata: message.metadata ?? {},
      context: message.context ?? {},
      errorCode: message.errorCode,
      timestamp: new Date().toLocaleString('uk-UA', {
        timeZone: 'Europe/Kiev'
      })
    };
  }

  async log(message: LoggerData, typeLog: LogType): Promise<void> {
    const level = this._mapLogLevel(typeLog);
    this.logger[level](this._formatLogData(message));
  }

  async info(message: LoggerData): Promise<void> {
    return this.log(message, LogType.Info);
  }

  async error(message: LoggerData): Promise<void> {
    return this.log(message, LogType.Error);
  }

  async debug(message: LoggerData): Promise<void> {
    return this.log(message, LogType.Debug);
  }

  async warning(message: LoggerData): Promise<void> {
    return this.log(message, LogType.Warning);
  }
}