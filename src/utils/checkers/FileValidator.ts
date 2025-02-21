import { constants, access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Config } from "@constants";
import type { Result } from "@type/utils/file";
import type { FolderCheckResult, IFileValidator } from "@type/utils/fileValidator";
import { emiliaError } from "@utils";

export class FileValidator implements IFileValidator {
  /**
     * Validates if the given file path is valid for the given operation (create or delete).
     * Checks if the file has a forbidden extension and not allowed extension, if the file exists and is writable.
     * @param {string} filePath - Path to the file
     * @returns {Result} result of the check
     * @example
     * ```ts
     * const result = await FileHandler.validateFileOperation("path/to/file.txt");
     * console.log(result); // { success: true }
     * ```
     */
  public async validateFileOperation(filePath: string): Promise<Result> {
    const checkResult = this.checkFormatFile(filePath);
    if (!checkResult.success) return checkResult;

    const existsResult = await this.checkFolder(filePath);

    if (!existsResult.exists) return { success: false, error: `File ${filePath} does not exist!` };
    if (!existsResult.writable) return { success: false, error: `File ${filePath} is not writable!` };

    return { success: true };
  }

  /**
   * Validates if the given file path has an allowed extension and not a forbidden one.
   *
   * Checks the file path against configured forbidden and allowed extensions.
   * 
   * @param {string} filePath - The file path to validate.
   * @returns {boolean} - True if the file path is valid (not forbidden and allowed), otherwise false.
   */
  // TODO: Переписати пізніше, бо тут не та логіка. Тут має бути валідні або не валідні папки
  public isValidPath(filePath: string): boolean {
    const isForbidden = Config.FORBIDDEN_EXTENSIONS.some(ext => filePath.endsWith(ext));
    const isAllowed = Config.ALLOWED_EXTENSIONS.some(ext => filePath.endsWith(ext));

    return !isForbidden && isAllowed;
  }

  /**
   * Checks if the given file path corresponds to a JSON file.
   * @param {string} filePath - The file path to check.
   * @returns {boolean} - True if the file is a JSON file, otherwise false.
   * @example
   * const filePath = "data.json";
   * const result = fileHandler.isJSONFile(filePath);
   * console.log(result); // true
   */
  public isJSONFile(filePath: string): boolean {
    return filePath.endsWith(".json");
  }

  /**
   * Checks if the given file path corresponds to a valid JSON file.
   * It checks if the file path is valid and if the file is a JSON file.
   * It reads the file and checks if it starts with a '{' or '['.
   * @param {string} filePath - The file path to check.
   * @returns {Promise<boolean>} - True if the file is a valid JSON file, otherwise false.
   * @example
   * const filePath = "data.json";
   * const result = await fileHandler.isValidJSONFile(filePath);
   * console.log(result); // false. There is .json file. This check for non .json file
   */
  public async isValidJSONFile(filePath: string): Promise<boolean> {
    if (!this.isValidPath(filePath) || this.isJSONFile(filePath)) return false;

    const data = await readFile(filePath, "utf-8");

    return data.startsWith("{") || data.startsWith("[");
  }

  /**
   * Checks if the given file has a forbidden extension and not allowed extension.
   * @param {string} filePath - Path to the file
   * @returns {Result} result of the check
   * @example
   * const result = FileHandler.checkFormatFile("path/to/file.txt");
   * console.log(result);
   * // { success: true }
   */
  public checkFormatFile(filePath: string): Result {
    const isForbidden = Config.FORBIDDEN_EXTENSIONS.some(ext => filePath.endsWith(ext));
    const isAllowed = Config.ALLOWED_EXTENSIONS.some(ext => filePath.endsWith(ext));

    return isForbidden && !isAllowed ? { success: false, error: "FileHandler: You cannot modify a file with this extension!" } : { success: true };
  }

  /**
     * Checks if the given folder exists and is writable.
     * @param {string} path - Path to the folder
     * @returns {Promise<FolderCheckResult>}
     * @example
     * const result = await FileHandler.checkFolder("path/to/folder");
     * console.log(result);
     * // {
     * //   exists: true,
     * //   writable: true
     * // }
     */
  async checkFolder(path: string): Promise<FolderCheckResult> {
    try {
      const patchFolder = resolve(path);
      await access(patchFolder, constants.F_OK | constants.W_OK);
      return {
        exists: true,
        writable: true,
        error: undefined
      };
    } catch (e) {
      emiliaError(e);
      return {
        exists: false,
        writable: false,
        error: "Folder does not exist or is not writable!"
      };
    }
  }
}
