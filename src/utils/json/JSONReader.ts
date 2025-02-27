import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { Config, Enums } from "@constants";
import type { ArrayNotEmpty } from "@type";
import type { ClassWithValidator, Result } from "@type/utils";
import type { IFileValidator } from "@type/utils/fileValidator";
import type { IJSONReader } from "@type/utils/jsonReader";
import { Decorators, Transforms, emiliaError } from "@utils";

export class JSONReader implements IJSONReader {
  /**
   * The category of the log entry.
   */
  public logCategories: ArrayNotEmpty<string> = ["jsonReader"];

  constructor(public fileValidator: IFileValidator) { }

  /**
   * Reads a file containing a single JSON object and parses it.
   *
   * If you need read non .json file - use {@link JSONReader.readLines} method.
   * 
   * @param filePath - The path to the JSON file.
   * @template T - The type of the JSON object to parse. Default is `unknown`.
   * @returns {Promise<Result<T>>} - A promise that resolves with a parsed JSON object. If the file is not a JSON file, returns an error.
   * 
   * @example
   * ```ts
   *  const filePath = "data.json"; //dont use at non .json file
   *  const result = await JSONReader.readFile(filePath);
   *  console.log(result); // { success: true, data: { name: "John", age: 30 } } if current file is a .json file
   * ```
   */
  @Decorators.logCaller()
  @Decorators.validateFileOperation<ClassWithValidator>()
  async readFile<T extends object>(filePath: string): Promise<Result<T>> {
    if (!this.fileValidator.isJSONFile(filePath)) return { success: false, error: { code: Enums.ErrorCode.FILE_FORMAT_ERROR, message: "You use this method about non .json file. You mistake. Use readLines method." } };

    const fileContent = await readFile(filePath, "utf-8");

    return this.parse<T>(fileContent);
  }

  /**
   * Reads a file containing JSON objects and parses its entries.
   * 
   * If need read .json file - use {@link JSONReader.readFile} method.
   * 
   * @param filePath - The path to the JSON file.
   * @param delimiter - The delimiter used to split the file content into individual JSON objects. Default is `\n`.
   * @template T - The type of the JSON objects to parse. Default is `unknown`.
   * @returns {Promise<Result<T>[]>} - A promise that resolves with an array of parsed JSON objects.
   * 
   * @example
   * ```
   *  const filePath = "data.log"; //dont use at .json file
   *  const delimiter = "\n";
   *  const result = await JSONReader.readLines(filePath, delimiter);
   *  console.log(result); // [{ key: 'value' }, { key: 'value' }] or [{ key: value }, { error: 'Error message' }, { key: 'value' }]
   * ```
   */
  @Decorators.logCaller()
  @Decorators.validateFileOperation<ClassWithValidator>()
  async readLines<T extends object>(
    filePath: string,
    delimiter: string = "\n",
  ): Promise<Result<T>[]> {
    let buffer = "";
    const lines: string[] = [];

    const transformStream = new Transform({
      transform(chunk, _encoding, callback) {
        buffer += chunk.toString();
        const parts = buffer.split(delimiter);
        buffer = parts.pop() ?? ""; // We store the unfinished fragment
        lines.push(...parts.filter(line => line.trim()));
        callback();
      },
      flush(callback) {
        if (buffer.trim()) lines.push(buffer.trim()); // Add the last fragment
        callback();
      },
    });

    await pipeline(
      createReadStream(filePath),
      transformStream,
    );

    const result = lines.map(line => this.parse<T>(line));

    // Check for error's on the result
    result.forEach((res, index) => {
      if (!res.success) {
        console.error(`Invalid object on ${index + 1} line in ${filePath} file. Error: ${res.error.message}, Code: ${res.error.code}`);
      }
    });

    // And return result;
    return result;
  }

  /**
   * Parses a JSON string into an object of type T.
   *
   * @template T - The type of the object to parse the JSON string into.
   * @param {string} jsonParse - The JSON string to parse.
   * @returns {Result<T>[]} - The result of the parsing operation, containing either the parsed object or an error message.
   * @throws {emiliaError} - Throws an error if the jsonParse string is empty or not provided.
   * @example
   * ```ts
   * const jsonParse = '{"name": "John", "age": 30}';
   * const result = JSONReader.parse<T>(jsonParse);
   * console.log(result); // { success: true, data: { name: "John", age: 30 } }
   * ```
   */
  @Decorators.logCaller()
  public parse<T = unknown>(jsonParse: string): Result<T> {
    if (!jsonParse || jsonParse.length === 0)
      throw emiliaError(
        "[JSONReader.parse]: jsonParse is required!",
        Enums.ErrorCode.ARGS_REQUIRED,
        "TypeError",
      );

    return Transforms.objectFromString<T>(jsonParse);
  }

  /**
   * Parses a JSON string into an object of type T.
   * 
   * @template T - The type of the object to parse the JSON string into.
   * @param {string} jsonParse - The JSON string to parse.
   * @returns {Result<T>} - An array of results. If all the parts are valid, it only returns successful results, otherwise all results with mistakes.
   * @throws {emiliaError} - Throws an error if the jsonParse string is empty or not provided.
   * @example
   * ```ts
   *  const jsonParse = '{"name": "John", "age": 30}\n{"name": "Jane", "age": 25}';
   *  const result = JSONReader.multiParse<T>(jsonParse);
   *  console.log(result); // [{ success: true, data: { name: "John", age: 30 } }, { success: true, data: { name: "Jane", age: 25 } }]
   * ```
   */
  @Decorators.logCaller()
  public multiParse<T = unknown>(jsonParse: string): Result<T>[] {
    if (!jsonParse || jsonParse.length === 0) {
      const error = { code: Enums.ErrorCode.ARGS_REQUIRED, message: "[JSONReader.parse]: jsonParse is required!" };
      console.error(error.message);

      throw emiliaError(error.message, error.code, "TypeError");
    }

    const isDelimiter = jsonParse.indexOf(Config.DELIMITER_LOG_FILE) !== -1;

    // If the delimiter is not found, return a single result
    if (!isDelimiter) return [this.parse<T>(jsonParse)];

    const parts = jsonParse.trim().split(Config.DELIMITER_LOG_FILE).filter(part => part.trim()); // We break the spaces
    const results: Result<T>[] = parts.map(part => {
      try {
        return Transforms.objectFromString<T>(part);
      } catch (e) {
        const error = { code: Enums.ErrorCode.JSON_PARSE_ERROR, message: `Parsing error: ${e.message}` };
        console.error(`A error on line "${part}": ${error.message}`);

        return { success: false, error };
      }
    });

    // If all parts are successful, return an array of data
    if (results.every<Result<T>>(r => r.success)) return [...results.filter(r => r.success)];

    // Otherwise, return all results with errors
    return results;
  }
}
