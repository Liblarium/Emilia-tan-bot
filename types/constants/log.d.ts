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
 * Result of adding a new log file
 */
export interface AddLogResult {
  /**
   * Path to log file if added successfully
   */
  success: boolean;
  /**
   * If have a error
   */
  error?: string;
};