import type { InlineType, LogType } from "@constants/enum/log";
import type { LogEntry } from "@type/constants/log";

/**
 * Interface for a logger.
 */
export interface Logger {
  /**
   * Logs a message.
   * @param message - The message to log.
   * @param typeLog - The type of the log entry.
   */
  log(message: LoggerData, typeLog: LogType): Promise<void>;
  /**
   * Logs an info message.
   * @param message - The message to log.
   */
  info(message: LoggerData): Promise<void>;
  /**
   * Logs an error message.
   * @param message - The message to log.
   */
  error(message: LoggerData): Promise<void>;
  /**
   * Logs an debug message.
   * @param message - The message to log.
   */
  debug(message: LoggerData): Promise<void>;
}

export type LoggerData = Omit<LogEntry, "type">;
export interface LoggerConsoleData extends LoggerData {
  inline?: InlineType
}