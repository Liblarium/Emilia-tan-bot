import type { Enums } from "@emilia-tan/utils";
import type { Observable } from "rxjs";
import type { LogEntry } from "./log";
/**
 * Interface for a logger.
 */
export interface LoggerType {
  /**
   * Logs a message.
   * @param message - The message to log.
   * @param typeLog - The type of the log entry.
   */
  log(message: LoggerData, typeLog: Enums.LogType): Promise<void> | Observable<void>;
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
  inline?: Enums.InlineType
}