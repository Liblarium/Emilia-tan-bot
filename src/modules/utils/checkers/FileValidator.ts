import { constants, access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_FILES,
  ALLOWED_FOLDERS,
  FORBIDDEN_EXTENSIONS,
  FORBIDDEN_FILES,
  FORBIDDEN_FOLDERS
} from "@core/config";
import { ErrorCode } from "@enum/errorCode";
import type {
  ArrayNotEmpty,
  FolderCheckResult,
  IFileValidator,
  Result,
} from "@type";
import { emiliaError } from "@utils/error/EmiliaError";

export class FileValidator implements IFileValidator {
  public logCategories: ArrayNotEmpty<string> = ["file_validator"];

  /**
   * Validates if the given file path is valid for the given operation (create or delete).
   * Checks if the file has a forbidden extension and not allowed extension, if the file exists and is writable.
   * @param {string} filePath - Path to the file
   * @returns {Promise<Result<void>>} result of the check
   * @example
   * ```ts
   * const result = await FileHandler.validateFileOperation("path/to/file.txt");
   * console.log(result); // { success: true }
   * ```
   */
  public async validateFileOperation(filePath: string): Promise<Result<void>> {
    const checkResult = this.checkFormatFile(filePath);
    if (!checkResult.success) return checkResult;

    const existsResult = await this.checkFolder(filePath);

    if (!existsResult.exists)
      return {
        success: false,
        error: {
          code: ErrorCode.FILE_NOT_FOUND,
          message: `File ${filePath} does not exist!`,
        },
      };
    if (!existsResult.writable)
      return {
        success: false,
        error: {
          code: ErrorCode.FILE_NOT_WRITABLE,
          message: `File ${filePath} is not writable!`,
        },
      };

    return { success: true, data: undefined };
  }

  /**
   * Validates if the file path meets all restrictions.
   * @param {string} filePath - Path to validate
   * @returns {boolean} - True if valid
   * @throws {EmiliaError} 
   * - `ErrorCode.INVALID_PATH` if path is empty
   * - `ErrorCode.FILE_FORMAT_ERROR` if config is empty
   * 
   * @example
   * // Returns true for valid path
   * isValidPath("src/utils/validFile.ts");
   * 
   * // Throws for empty path
   * isValidPath(""); 
   */
  public isValidPath(filePath: string): boolean {
    this.validateConfig(filePath);

    return (
      this.isExtensionValid(filePath) &&
      this.isFolderValid(filePath) &&
      this.isFileValid(filePath)
    );
  }

  /**
   * Validates the configuration for file operations.
   *
   * Ensures that the provided file path is not empty and checks that the configuration arrays for forbidden and allowed
   * extensions, folders, and files are not empty. Throws an error if any of these conditions are not met.
   *
   * @param {string} filePath - The file path to validate.
   * @throws {EmiliaError} If the file path is empty or if the configuration arrays are empty.
   */
  private validateConfig(filePath: string): void {
    if (!filePath) {
      throw emiliaError(
        "File path is empty!",
        ErrorCode.INVALID_PATH,
        "InternalError",
      );
    }

    const isEmptyConfig = [
      FORBIDDEN_EXTENSIONS,
      ALLOWED_EXTENSIONS,
      FORBIDDEN_FOLDERS,
      ALLOWED_FOLDERS,
      FORBIDDEN_FILES,
    ].every((arr) => arr.length === 0);

    if (isEmptyConfig) {
      throw emiliaError(
        "Forbidden or allowed extensions are empty! See constants/ts!",
        ErrorCode.FILE_FORMAT_ERROR,
        "InternalError",
      );
    }
  }

  private isExtensionValid(filePath: string): boolean {
    const isForbidden = FORBIDDEN_EXTENSIONS.some((ext) =>
      filePath.endsWith(ext),
    );
    const isAllowed = ALLOWED_EXTENSIONS.some((ext) =>
      filePath.endsWith(ext),
    );

    return !isForbidden && isAllowed;
  }

  private isFolderValid(filePath: string): boolean {
    const isForbiddenFolder = FORBIDDEN_FOLDERS.some((folder) =>
      filePath.includes(folder),
    );
    const isAllowedFolder = ALLOWED_FOLDERS.some((folder) =>
      filePath.includes(folder),
    );

    return !isForbiddenFolder && isAllowedFolder;
  }

  private isFileValid(filePath: string): boolean {
    const isForbiddenFile = FORBIDDEN_FILES.some((file) =>
      filePath.includes(file),
    );
    const isAllowedFile = ALLOWED_FILES.length === 0 ? true :
      ALLOWED_FILES.some((file) => filePath.includes(file));

    return !isForbiddenFile && isAllowedFile;
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
   * It reads the file and checks if it starts with a "{" or "[".
   * @param {string} filePath - The file path to check.
   * @returns {Promise<boolean>} - True if the file is a valid JSON file, otherwise false.
   * @example
   * const filePath = "data.json";
   * const result = await fileHandler.isValidJSONFile(filePath);
   * console.log(result); // false. There is .json file. This check for non .json file
   * const logFilePath = "file.log";
   * const resultLog = await fileHandler.isValidJSONFile(logFilePath);
   * console.log(resultLog); // true. There is non .json file. And have valid form
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
  public checkFormatFile(filePath: string): Result<void> {
    const isForbidden = FORBIDDEN_EXTENSIONS.some((ext) =>
      filePath.endsWith(ext),
    );
    const isAllowed = ALLOWED_EXTENSIONS.some((ext) =>
      filePath.endsWith(ext),
    );

    return isForbidden && !isAllowed
      ? {
        success: false,
        error: {
          code: ErrorCode.FILE_FORMAT_ERROR,
          message:
            "FileHandler: You cannot modify a file with this extension!",
        },
      }
      : { success: true, data: undefined };
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
    if (!this.isValidPath(path))
      return {
        exists: false,
        writable: false,
        error: {
          code: ErrorCode.INVALID_PATH,
          message:
            "You checked folder with black list folders! Please - see at allow/deny folders on config file.",
        },
      };
    try {
      const patchFolder = resolve(path);
      await access(patchFolder, constants.F_OK | constants.W_OK);
      return {
        exists: true,
        writable: true,
        error: undefined,
      };
    } catch (e) {
      emiliaError(e, ErrorCode.FOLDER_INVALID);
      return {
        exists: false,
        writable: false,
        error: {
          code: ErrorCode.FOLDER_INVALID,
          message:
            "Folder does not exist or is not writable! Please check the folder path and permissions.",
        },
      };
    }
  }
}
