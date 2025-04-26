import type { InlineType, LogType } from "@enum/log";
import type { LogEntry } from "@type";
import type { Observable } from "rxjs";
/**
 * Interface for a logger.
 */
export interface Logger {
  /**
   * Logs a message.
   * @param message - The message to log.
   * @param typeLog - The type of the log entry.
   */
  log(message: LoggerData, typeLog: LogType): Promise<void> | Observable<void>;
  /**
   * Logs an info message.
   * @param message - The message to log.
   */
  info(message: LoggerData): Promise<void> | Observable<void>;
  /**
   * Logs an error message.
   * @param message - The message to log.
   */
  error(message: LoggerData): Promise<void> | Observable<void>;
  /**
   * Logs an debug message.
   * @param message - The message to log.
   */
  debug(message: LoggerData): Promise<void> | Observable<void>;
  /**
   * Logs a warning message.
   * @param message - The message to log.
   */
  warning(message: LoggerData): Promise<void> | Observable<void>;
}

export type LoggerData = Omit<LogEntry, "type">;
export interface LoggerConsoleData extends LoggerData {
  inline?: InlineType
}