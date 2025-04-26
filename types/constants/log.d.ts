import type { ErrorCode } from "@enum/errorCode";
import type { LogType } from "@enum/log";
import type { InlineType } from "@enum/log";
import type {
  ArrayNotEmpty,
  ClassWithFileManager,
  ClassWithJSONReader,
  ClassWithJSONWriter,
  ClassWithValidator,
  ILogFormatters,
  Result
} from "@type";

export type LineType = { news: "" | "\n"; last: "" | "\n" };
export type LogTypeNumber = 1 | 2 | 3 | 4;

export interface AbstractLogOptions {
  /**
   * Text which will be written to log
   */
  text: TypeText;
  /**
   * Type of log
   */
  type: LogType;
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
  inline: InlineType;
  /**
   * Categories of log
   */
  categories: ArrayNotEmpty<string>;
  /**
   * Code of error which will be written to log
   */
  code: ErrorCode;
  /**
   * Metadata of log. It is an object which can contain any information.
   * It will be written to log as a JSON string.
   * @type {Record<string, unknown>}
   * @default {undefined}
   * @example
   * {
   *   key: "value",
   *   foo: "bar"
   * }
   */
  metadata?: Record<string, unknown>;
  /**
   * Context of log. It is an object which can contain any information.
   * It will be written to log as a JSON string.
   * @type {Record<string, unknown>}
   * @default {{}}
   * @example
   * {
   *   key: "value",
   *   foo: "bar"
   * }
   */
  context?: Record<string, unknown>;
  /**
   * Tags associated with the log.
   * It is an optional array of strings.
   * @type {string[]}
   * @default {[]}
   */
  tags?: string[];
}

export interface IAbstractLogWithDependencies
  extends ClassWithJSONReader,
  ClassWithJSONWriter,
  ClassWithJSONReader,
  ClassWithFileManager,
  ClassWithValidator,
  ClassWithLogFormatter { }

export interface AbstractLogOptionsExtended
  extends AbstractLogOptions,
  IAbstractLogWithDependencies { }

export interface ClassWithLogFormatter {
  logFormatter: ILogFormatters;
}

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

export interface AddLogOptions {
  text: TypeText;
  logType: LogType;
  tags?: string[];
  metadata?: object;
  context?: object;
  errorCode: ErrorCode;
}

export interface IAbstractLog extends IAbstractLogWithDependencies {
  findLogsByTags(
    tags: string[],
    matchAll?: boolean,
    month?: boolean,
  ): Promise<Result<LogEntry>[]>;
}

export type LogTags = string[];