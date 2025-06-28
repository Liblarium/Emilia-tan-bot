import type { ErrorCode, InlineType, LogType } from "@emilia-tan/config";
import type { ArrayNotEmpty } from "../index.type.d.ts";
import type { FileLoggerOptions } from "./fileLogger.d.ts";
import type { LoggerType } from "./logger.d.ts";
import type { PinoLoggerOptions } from "./pino.d.ts";

/**
 * Options for Log class
 * @property {TypeText} text - Log contents
 * @property {TypeLog} type - information type. Numeric: 1 - info, 2 - error, 3- warning, 4 - debug, 5 - test
 * @property {ArrayNotEmpty<string>} categories - In which categories to write all specified logs. Outputted once in console.log(). Not necessarily global or database, string[] there
 * @property {boolean} [event=false] - Whether to truncate output in console.log().
 * @property {boolean} [logs=true] - Whether to output text to console. By default, true
 * @property {TypeInline} [inline=0] - Affects only the text in the console. 0 - No change, 1 - wrap from top to bottom, 2 - from bottom, 3 - both.
 * @example
 * const options: LogOptions = {
 *   text: "Hello from LogOptions",
 *   type: 1,
 *   categories: ["category1", "category2"],
 *   event: false,
 *   logs: true,
 *   inline: InlineType.Before,
 * };
 *
 * new Log(options); // [time]: Hello from LogOptions
 */
export interface LogOptions extends LogDeps {
  /**
   * Log contents
   */
  text: TypeText;
  /**
   * information type. Numeric: 1 - info, 2 - error, 3- warning, 4 - debug, 5 - test
   *
   * Or you can use LogType (enum)
   *
   * @default LogType.Info = "info"
   */
  type: LogType;
  /**
   * The error code
   */
  code: ErrorCode;
  /**
   * In which categories to write all specified logs. Outputted once in console.log(). Not necessarily global or database, string[] there
   */
  categories: ArrayNotEmpty<string>;
  /**
   * Whether to output text to console. Once. By default, true
   * @default true
   */
  logs?: boolean;
  /**
   * Affects only the text in the console. 0 - No change, 1 - wrap from top to bottom, 2 - from bottom, 3 - both.
   * @default InlineType.None = 0
   */
  inline?: InlineType;
  /**
   * Tags to add to the log
   * @default []
   */
  tags: string[];
  /**
   * Metadata to add to the log
   */
  metadata?: object;
  /**
   * Context to add to the log
   */
  context?: object;
}

export type LogFactoryOptions = Omit<LogOptions, "consoleLogger" | "fileLogger">;

export type LoggableOptions = Omit<LogFactoryOptions, "logFormatter">;

export type TypeText = string | number | object | unknown[] | unknown;

export interface LogFactoryOptionalOptions {
  pinoOption: PinoLoggerOptions;
  fileOption: FileLoggerOptions;
}

export interface LogDeps {
  /**
   * The console logger
   */
  consoleLogger: LoggerType;
  /**
   * The file logger
   */
  fileLogger: LoggerType;
}

/**
 * Interface for a log entry
 */
export interface LogEntry {
  /**
   * Text of the log entry
   */
  readonly text: TypeText;
  /**
   * Type of the log entry
   */
  readonly type: LogType;
  /**
   * Categories of the log entry
   */
  readonly categories: ArrayNotEmpty<string>;
  /**
   * Metadata of the log entry
   */
  readonly metadata?: object;
  /**
   * Context of the log entry
   */
  readonly context?: object;
  /**
   * Error code of the log entry
   */
  readonly errorCode: ErrorCode;
  /**
   * Tags associated with the log entry
   */
  readonly tags: LogTags;
}

export type LogTags = string[];
