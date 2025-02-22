export type LineType = { news: "" | "\n"; last: "" | "\n" };
export type LogTypeNumber = 1 | 2 | 3 | 4 | 5;
import type { Enums } from "@constants";
export interface BaseLogOptions {
  /**
   * Text which will be written to log
   */
  text: TypeText;
  /**
   * Type of log
   */
  type: TypeLog;
  /**
   * Event mode. If true, log will be written in format: [time] [category] [type]: text
   */
  event: boolean;
  /**
   * If true, log will be written to console
   */
  logs: boolean;
  /**
   * Inline mode. If 0 - no inline, if 1 - add new line at start, if 2 - add new line at end, if 3 - add new lines at start and end
   */
  inline: TypeInline
  /**
   * Metadata of log. It is an object which can contain any information.
   * It will be written to log as a JSON string.
   * @type {object}
   * @default {undefined}
   * @example
   * {
   *   key: "value",
   *   foo: "bar"
   * }
   */
  metadata?: object;
  /**
   * Context of log. It is an object which can contain any information.
   * It will be written to log as a JSON string.
   * @type {object}
   * @default {object}
   * @example
   * {
   *   key: "value",
   *   foo: "bar"
   * }
   */
  context?: object;
  /**
   * Tags associated with the log.
   * It is an optional array of strings.
   * @type {string[]}
   * @default {[]}
   */
  tags?: string[];
}

/**
 * Type of log. It is a union of LogType and LogTypeNumber
 */
export type TypeLog = Enums.LogType | LogTypeNumber;

/**
 * Type of text
 */
export type TypeText = string | number | object | unknown[] | unknown;

/**
 * Type for the result of file format check
 */
export type CheckFormatFileResult = { success: boolean; error?: string };

/**
 * Interface for a log entry
 */
export interface LogEntry {
  /**
   * Text of the log entry
   */
  text: TypeText;
  /**
   * Type of the log entry
   */
  type: TypeLog;
  /**
   * Category of the log entry
   */
  category: string;
  /**
   * Metadata of the log entry
   */
  metadata?: object;
  /**
   * Context of the log entry
   */
  context?: object;
  /**
   * Timestamp of the log entry
   */
  timestamp: string;
  /**
   * Tags associated with the log entry
   */
  tags: string[];
}

export interface AddLogOptions {
  text: TypeText;
  logType: TypeLog;
  tags?: string[];
  metadata?: object;
  context?: object;
  errorCode: Enums.ErrorCode
}