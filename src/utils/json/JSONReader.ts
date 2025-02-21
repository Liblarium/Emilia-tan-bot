import { readFile } from "node:fs/promises";
import type { ArrayNotEmpty } from "@type";
import type { ClassWithValidator, Result } from "@type/utils/file";
import type { IFileValidator } from "@type/utils/fileValidator";
import type { IJSONReader } from "@type/utils/jsonReader";
import { Decorators, Transforms, emiliaError } from "@utils";

export class JSONReader implements IJSONReader {
  public readonly fileValidator: IFileValidator;
  /**
   * The category of the log entry.
   */
  public readonly logCategories: ArrayNotEmpty<string> = ["jsonReader"];

  constructor(fileValidator: IFileValidator) {
    this.fileValidator = fileValidator;
  }


  /**
   * Reads a file containing a single JSON object and parses it.
   *
   * If you need read non .json file - use {@link JSONReader.readLines} method.
   * 
   * @param filePath - The path to the JSON file.
   * @template T - The type of the JSON object to parse. Default is `unknown`.
   * @returns {Promise<Result<T>>} - A promise that resolves with a parsed JSON object. If the file is not a JSON file, returns an error.
   */
  @Decorators.logCaller()
  @Decorators.validateFileOperation<ClassWithValidator>()
  async readFile<T extends object>(filePath: string): Promise<Result<T>> {
    if (!this.fileValidator.isJSONFile(filePath)) return { success: false, error: "You use this method about non .json file. You mistake. Use readLines method." };

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
   *  const filePath = "data.log"; //dont use at .json file
   *  const delimiter = "\n";
   *  const result = await JSONReader.readLines(filePath, delimiter);
   *  console.log(result); // [{ key: 'value' }, { key: 'value' }] or [{ key: value }, { error: 'Error message' }, { key: 'value' }]
   */
  @Decorators.logCaller()
  @Decorators.validateFileOperation<ClassWithValidator>()
  async readLines<T extends object>(
    filePath: string,
    delimiter: string = "\n",
  ): Promise<Result<T>[]> {
    if (this.fileValidator.isJSONFile(filePath)) return [{ success: false, error: "You use this method about .json file. You mistake. Use readFile method." }];

    const fileContent = await readFile(filePath, "utf-8");

    const lines = fileContent.split(delimiter).filter(line => line.trim());

    return lines.map(line => this.parse<T>(line));
  }

  /**
   * Parses a JSON string into an object of type T.
   *
   * @template T - The type of the object to parse the JSON string into.
   * @param {string} jsonParse - The JSON string to parse.
   * @returns {Result<T>} - The result of the parsing operation, containing either the parsed object or an error message.
   * @throws {TypeError} - Throws an error if the jsonParse string is empty or not provided.
   */
  @Decorators.logCaller()
  parse<T extends object>(jsonParse: string): Result<T> {
    if (!jsonParse || jsonParse.length === 0)
      throw emiliaError(
        "[JSONReader.parse]: jsonParse is required!",
        "TypeError",
      );

    const result = Transforms.objectFromString<T>(jsonParse);

    return result
      ? { success: true, data: result }
      : { success: false, error: "Error parsing JSON" };
  }
}
