import type { ErrorCode } from "../enums/errorCode";
import type { JSONReader } from "../json/jsonReader";
import type { JSONWriter } from "../json/jsonWriter";
import type { IFileManager } from "./fileManager";
import type { IFileValidator } from "./fileValidator";
import type { ILogFormatters } from "./logFormatter";

/**
 * Error details
 */
export interface ErrorDetails {
  /**
   * The error code
   *
   * @type {string}
   *
   * {@link ErrorCode} - Enum for error codes and more info about error codes
   *
   * @example
   * const error = { code: ErrorCode.FILE_NOT_FOUND, message: "The file was not found." };
   */
  code: ErrorCode;
  /**
   * The error message
   * @type {string}
   * Example: "This object is invalid. Please check the object and try again."
   */
  message: string;
}

/**
 * The result of a file operation
 */
export type Result<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: ErrorDetails };

export interface ClassWithValidator {
  /**
   * The file validator
   */
  fileValidator: IFileValidator;
}
export interface ClassWithFileManager {
  /**
   * The file manager
   */
  fileManager: IFileManager;
}
export interface ClassWithJSONReader {
  /**
   * The JSON reader
   */
  jsonReader: JSONReader;
}
export interface ClassWithJSONWriter {
  /**
   * The JSON writer
   */
  jsonWriter: JSONWriter;
}

export interface ClassWithLogFormatter {
  /**
   * The log formatter
   */
  logFormatter: ILogFormatters;
}

// Re-export all utils types
export * from "./fileManager";
export * from "./fileValidator";
export * from "./isClass";
export * from "./jsonReader";
export * from "./jsonWriter";
export * from "./logFormatter";
export * from "./ValidationTypes";
export * from "./components";
