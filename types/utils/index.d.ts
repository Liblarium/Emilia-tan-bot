import type { ErrorCode } from "@constants/enum/errorCode";
import type { JSONReader } from "@utils/json/JSONReader";
import type { JSONWriter } from "@utils/json/JSONWriter";
import type { IFileManager } from "./fileManager";
import type { IFileValidator } from "./fileValidator";

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
export type Result<T = unknown> = { success: true; data: T } | { success: false; error: ErrorDetails };

export interface ClassWithValidator {
  /**
   * The file validator
   */
  fileValidator: IFileValidator;
};
export interface ClassWithFileManager {
  /**
   * The file manager
   */
  fileManager: IFileManager;
};
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