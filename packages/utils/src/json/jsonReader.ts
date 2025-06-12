import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { ErrorCode } from "@emilia-tan/config";
import type { ArrayNotEmpty } from "@emilia-tan/types";
import { Observable } from "rxjs";
import { DELIMITER_LOG_FILE } from "../config";
import { emiliaError } from "../core/emiliaError";
import { getErrorMessage } from "../core/getErrorMessage";
import { objectFromString } from "../transform/stringify";
import type { ClassWithValidator, IFileValidator, IJSONReader, Result } from "../types";
import { validateFileOperation } from "../validate/validateFileOperation";

export class JSONReader implements IJSONReader {
  /**
   * The category of the log entry.
   */
  public logCategories: ArrayNotEmpty<string> = ["jsonReader"];

  constructor(public fileValidator: IFileValidator) {}
  readLines<T extends object>(filePath: string, delimiter: string): Promise<Result<T>[]> {
    throw new Error("Method not implemented.");
  }

  /**
   * Reads a file containing a single JSON object and parses it using RxJS.
   *
   * If you need to read a non .json file - use {@link JSONReader.readLines} method.
   *
   * @param filePath - The path to the JSON file.
   * @template T - The type of the JSON object to parse. Default is `unknown`.
   * @returns {Observable<Result<T>>} - An observable that emits the parsed JSON object. If the file is not a JSON file, emits an error.
   *
   * @example
   * ```ts
   *  const result$ = JSONReader.readFileRx(filePath);
   *  result$.subscribe({
   *    next: result => console.log(result), // { success: true, data: { name: "John", age: 30 } }
   *    error: err => console.error(err),
   *  });
   * ```
   */
  @validateFileOperation<ClassWithValidator>()
  readFile<T extends object>(filePath: string): Observable<Result<T>> {
    return new Observable<Result<T>>((subscriber) => {
      if (!this.fileValidator.isJSONFile(filePath)) {
        subscriber.error({
          success: false,
          error: {
            code: ErrorCode.FILE_FORMAT_ERROR,
            message: "You use this method about non .json file. You mistake. Use readLines method.",
          },
        });
        return;
      }

      readFile(filePath, "utf-8")
        .then((fileContent) => {
          const result = this.parse<T>(fileContent);
          subscriber.next(result);
          subscriber.complete();
        })
        .catch((err) => {
          subscriber.error({
            success: false,
            error: {
              code: ErrorCode.FILE_READ_ERROR,
              message: `Failed to read file: ${getErrorMessage(err)}`,
            },
          });
        });
    });
  }

  /**
   * Reads a file containing JSON objects and parses its entries using RxJS.
   *
   * If need read .json file - use {@link JSONReader.readFile} method.
   *
   * @param filePath - The path to the JSON file.
   * @param delimiter - The delimiter used to split the file content into individual JSON objects. Default is `\n`.
   * @template T - The type of the JSON objects to parse. Default is `unknown`.
   * @returns {Observable<Result<T>>} - An observable that emits parsed JSON objects one by one.
   *
   * @example
   * ```ts
   *  const filePath = "data.log"; //don't use at .json file
   *  const delimiter = "\n";
   *  const result$ = JSONReader.readLinesRx(filePath, delimiter);
   *  result$.subscribe({
   *    next: result => console.log(result), // { success: true, data: { key: 'value' } }
   *    error: err => console.error(err),
   *    complete: () => console.log("Completed"),
   *  });
   * ```
   */
  @validateFileOperation<ClassWithValidator>()
  readLinesRx<T extends object>(filePath: string, delimiter: string = "\n"): Observable<Result<T>> {
    return new Observable<Result<T>>((subscriber) => {
      let buffer = "";

      const jsonReaderInstance = this; // Capture the JSONReader instance
      const transformStream = new Transform({
        transform(chunk, _encoding, callback) {
          buffer += chunk.toString();
          const parts = buffer.split(delimiter);
          buffer = parts.pop() ?? ""; // Store the unfinished fragment
          parts
            .filter((line) => line.trim())
            .forEach((line) => {
              try {
                const result = jsonReaderInstance.parse<T>(line); // Use the captured instance
                subscriber.next(result);
              } catch (err) {
                subscriber.next({
                  success: false,
                  error: {
                    code: ErrorCode.JSON_PARSE_ERROR,
                    message: `Parsing error: ${getErrorMessage(err)}`,
                  },
                });
              }
            });
          callback();
        },
        flush(callback) {
          if (buffer.trim()) {
            try {
              const result = jsonReaderInstance.parse<T>(buffer.trim()); // Use the captured instance
              subscriber.next(result);
            } catch (err) {
              subscriber.next({
                success: false,
                error: {
                  code: ErrorCode.JSON_PARSE_ERROR,
                  message: `Parsing error: ${getErrorMessage(err)}`,
                },
              });
            }
          }
          callback();
        },
      });

      pipeline(createReadStream(filePath), transformStream)
        .then(() => subscriber.complete())
        .catch((err) => {
          subscriber.error({
            success: false,
            error: {
              code: ErrorCode.FILE_READ_ERROR,
              message: `Failed to read file: ${getErrorMessage(err)}`,
            },
          });
        });
    });
  }

  /**
   * Parses a JSON string into an object of type T.
   *
   * @template T - The type of the object to parse the JSON string into.
   * @param {string} jsonParse - The JSON string to parse.
   * @returns {Result<T>} - The result of the parsing operation, containing either the parsed object or an error message.
   * @throws {emiliaError} - Throws an error if the jsonParse string is empty or not provided.
   * @example
   * ```ts
   * const jsonParse = '{"name": "John", "age": 30}';
   * const result = JSONReader.parse<T>(jsonParse);
   * console.log(result); // { success: true, data: { name: "John", age: 30 } }
   * ```
   */
  public parse<T = unknown>(jsonParse: string): Result<T> {
    if (!jsonParse || jsonParse.length === 0) {
      const error = {
        code: ErrorCode.ARGS_REQUIRED,
        message: "[JSONReader.parse]: jsonParse is required!",
      };
      console.error(error.message);

      throw emiliaError(error.message, error.code, "TypeError");
    }

    try {
      return objectFromString<T>(jsonParse);
    } catch (e) {
      const error = {
        code: ErrorCode.JSON_PARSE_ERROR,
        message: `Parsing error: ${getErrorMessage(e)}`,
      };
      console.error(error.message);

      return { success: false, error };
    }
  }

  /**
   * Parses a JSON string into an object of type T.
   *
   * @template T - The type of the object to parse the JSON string into.
   * @param {string} jsonParse - The JSON string to parse.
   * @returns {Result<T>[]} - An array of results. If all the parts are valid, it only returns successful results, otherwise all results with mistakes.
   * @throws {emiliaError} - Throws an error if the jsonParse string is empty or not provided.
   * @example
   * ```ts
   *  const jsonParse = '{"name": "John", "age": 30}\n{"name": "Jane", "age": 25}';
   *  const result = JSONReader.multiParse<T>(jsonParse);
   *  console.log(result); // [{ success: true, data: { name: "John", age: 30 } }, { success: true, data: { name: "Jane", age: 25 } }]
   * ```
   */
  public multiParse<T = unknown>(jsonParse: string): Result<T>[] {
    if (!jsonParse || jsonParse.length === 0) {
      const error = {
        code: ErrorCode.ARGS_REQUIRED,
        message: "[JSONReader.parse]: jsonParse is required!",
      };
      console.error(error.message);

      throw emiliaError(error.message, error.code, "TypeError");
    }

    const isDelimiter = jsonParse.indexOf(DELIMITER_LOG_FILE) !== -1;

    // If the delimiter is not found, return a single result
    if (!isDelimiter) return [this.parse<T>(jsonParse)];

    const parts = jsonParse
      .trim()
      .split(DELIMITER_LOG_FILE)
      .filter((part) => part.trim()); // We break the spaces
    const results: Result<T>[] = parts.map((part) => {
      try {
        return objectFromString<T>(part);
      } catch (e) {
        const error = {
          code: ErrorCode.JSON_PARSE_ERROR,
          message: `Parsing error: ${getErrorMessage(e)}`,
        };
        console.error(`A error on line "${part}": ${error.message}`);

        return { success: false, error };
      }
    });

    // If all parts are successful, return an array of data
    if (results.every<Result<T>>((r) => r.success)) return [...results.filter((r) => r.success)];

    // Otherwise, return all results with errors
    return results;
  }
}
