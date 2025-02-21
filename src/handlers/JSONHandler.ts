import { readFile } from "node:fs/promises";
import type { ArrayNotEmpty } from "@type";
import type { ReadJSONFileResult } from "@type/handler";
import type { Result } from "@type/utils/file";
import {
  Checkers,
  Decorators,
  Formatters,
  Managers,
  Transforms,
  emiliaError,
} from "@utils";

const fileManager = new Managers.FileManager(new Checkers.FileValidator());

export class JSONHandler {
  /**
   * The category of the log entry.
   * @type {ArrayNotEmpty<string>}
   */
  static readonly logCategories: ArrayNotEmpty<string> = ["JSON", "handler"];

  /**
   * Black list of paths to ignore when reading a file.
   */
  private static readonly blackListPath = ["node_modules", "dist"];

  /**
   * Reads a file containing JSON objects and parses its entries.
   *
   * If need read .json file - use `readStandardJSONFile` method.
   *
   * @param filePath - The path to the JSON file.
   * @param delimiter - The delimiter used to split the file content into individual JSON objects. Default is `\n`.
   * @template T - The type of the JSON objects to parse. Default is `unknown`.
   * @returns {Promise<ReadJSONFileResult<T>[]>} - A promise that resolves with an array of parsed JSON objects.
   *
   * @example
   * ```ts
   * import { JSONHandler } from "path/to/json/JSONHandler";
   *
   * const result = await JSONHandler.readJSONFile('data.log', '\n');
   * console.log(result); // [{ key: 'value' }, { key: 'value' }] or [{ key: value }, { error: 'Error message' }, { key: 'value' }]
   * ```
   */
  static async readJSONFile<T extends object = object>(
    path: string,
  ): Promise<ReadJSONFileResult<T> | void>;
  static async readJSONFile<T extends object = object>(
    filePath: string,
    delimiter?: string,
  ): Promise<ReadJSONFileResult<T>[]>;
  @Decorators.logCaller()
  static async readJSONFile<T extends object = object>(
    filePath: string,
    delimiter?: string,
  ): Promise<ReadJSONFileResult<T>[] | ReadJSONFileResult<T>> {
    // Validate the file for reading JSON content.
    const result = await JSONHandler.validateFile(filePath);
    if (!result)
      return [{ error: "File is not valid for reading JSON content." }];

    if (!delimiter && !filePath.endsWith(".json"))
      return {
        error:
          "File is not a JSON file. If you want to read a non `.json` file, please specify the delimiter.",
      };

    // Read the file content.
    const fileContent = await readFile(filePath, "utf-8");

    if (delimiter) {
      // Split the file content into individual JSON objects by the delimiter.
      const lines = fileContent.split(delimiter).filter((line) => line.trim());

      // Parse each JSON object and return an array of them.
      return lines.reduce<ReadJSONFileResult<T>[]>((acc, line, index) => {
        try {
          // Try to parse the JSON object from the current line.
          const res = Transforms.objectFromString<T>(line);

          // If the JSON object is invalid, throw an error.
          if (!res) throw emiliaError("JSON object is invalid!", "TypeError");

          // If the JSON object is valid, add it to the array.
          acc.push({ ...res });
        } catch {
          // If an error occurred while parsing the JSON object, log it and skip it.
          acc.push({
            error: `Invalid JSON object at position ${index} in the file ${filePath}. This object will be skipped.`,
          });
        }

        // Return the array of parsed JSON objects.
        return acc;
      }, []);
    }

    // If no delimiter is specified and the file is a JSON file, parse the JSON content.
    const jsonString = fileContent.trim();
    const json = Transforms.objectFromString<T>(jsonString);

    // If the JSON object is invalid, throw an error.
    if (!json)
      return {
        error: "JSON object is invalid! Please check the file content.",
      };

    // Return the parsed JSON object.
    return json;
  }

  /**
   * Appends a JSON object to a file.
   *
   * This method serializes a JSON object and appends it to the specified file.
   * If the file does not exist, it will be created.
   *
   * @param filePath - The path to the JSON file.
   * @param data - The JSON object to append.
   * @param delimiter - The delimiter used to separate JSON objects in the file. Default is '\n'.
   * @returns {Promise<AppendFileResult>} - A promise that resolves with the result of the append operation.
   *
   * @example
   * const result = await JSONHandler.writeJSONToFile('data.json', { key: 'value' });
   * console.log(result); // { success: true }
   */
  @Decorators.logCaller()
  static async writeJSONToFile(
    filePath: string,
    data: object,
    delimiter: string = "\n",
  ): Promise<Result> {
    // Validate the file for writing JSON content.
    const isValid = await JSONHandler.validateFile(filePath);

    // If the file is not valid, return an error.
    if (!isValid)
      return {
        success: false,
        error: "File is not valid for writing JSON content.",
      };

    // Serialize the JSON object and append it to the file.
    const jsonString = `${Formatters.objectToString(data)}${delimiter}`;

    // Append the JSON string to the file.
    return fileManager.appendFile(filePath, jsonString);
  }

  /**
   * Validates the file for reading JSON content.
   * @param filePath - The path to the file to validate.
   * @returns {Promise<boolean>} - A promise that resolves to true if the file is valid, or throws an error otherwise.
   * @private
   */
  @Decorators.logCaller()
  private static async validateFile(filePath: string): Promise<boolean> {
    // Check if the file path is blacklisted.
    if (JSONHandler.blackListPath.some((path) => filePath.includes(path)))
      throw emiliaError(
        `File path ${filePath} is blacklisted!`,
        "PermissionError",
      );

    // Check if the file exists and is writable.
    const fileExistAndWritable =
      await JSONHandler.checkFileExistsAndWritable(filePath);
    if (!fileExistAndWritable) return false;

    // Check if the file is empty.
    const fileEmpty = await JSONHandler.checkIfFileEmpty(filePath);
    if (fileEmpty) return false;

    // Check if the file is a JSON file.
    const isJSONFile = await JSONHandler.checkIfJSONFile(filePath);
    if (!isJSONFile)
      throw emiliaError(`${filePath} is not a valid JSON file!`, "TypeError");

    return true;
  }

  /**
   * Checks if a file exists and is writable.
   *
   * This method verifies the existence of a file at the specified path and checks if it has write permissions.
   *
   * @param filePath - The path to the file to check.
   * @returns A promise that resolves to `true` if the file exists and is writable, or `void` if an error is thrown.
   * @throws {EmiliaError} Throws a "NotFoundError" if the file does not exist.
   * @throws {EmiliaError} Throws a "PermissionError" if the file is not writable.
   */
  @Decorators.logCaller()
  private static async checkFileExistsAndWritable(
    filePath: string,
  ): Promise<true | void> {
    // Check if the file exists.
    const fileExists = await fileManager.fileValidator.checkFolder(filePath);
    if (!fileExists.exists)
      throw emiliaError(`File ${filePath} does not exist!`, "NotFoundError");

    // Check if the file is writable.
    if (!fileExists.writable)
      throw emiliaError(`File ${filePath} is not writable!`, "PermissionError");

    return true;
  }

  /**
   * Checks if a file is empty.
   *
   * @param filePath - The path to the file.
   * @returns {Promise<boolean>} - A promise that resolves with `true` if the file is empty, or `false` otherwise.
   */
  static async checkIfFileEmpty(filePath: string): Promise<boolean> {
    // Check if the file exists.
    const fileExists = await fileManager.fileValidator.checkFolder(filePath);
    if (!fileExists.exists) return true;

    // Check if the file is empty.
    const fileContent = await readFile(filePath, "utf-8");
    return fileContent.trim() === "";
  }

  /**
   * Checks if a file is a valid JSON file.
   *
   * @param filePath - The path to the file.
   * @returns {Promise<boolean>} - A promise that resolves with `true` if the file is a valid JSON file, or `false` otherwise.
   */
  static async checkIfJSONFile(filePath: string): Promise<boolean> {
    // Check if the file exists.
    const fileExists = await fileManager.fileValidator.checkFolder(filePath);
    if (!fileExists.exists) return false;

    // Check if the file is a JSON file.
    const fileContent = await readFile(filePath, "utf-8");

    // Check if the file content starts with '{' or '['.
    return /^[{[]/.test(fileContent.trim());
  }
}
