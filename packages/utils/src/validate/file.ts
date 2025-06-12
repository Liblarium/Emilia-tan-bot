import { constants, access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { ErrorCode } from "@emilia-tan/config";
import type { ArrayNotEmpty } from "@emilia-tan/types";
import { type Observable, combineLatest, from, lastValueFrom, of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_FILES,
  ALLOWED_FOLDERS,
  FORBIDDEN_EXTENSIONS,
  FORBIDDEN_FILES,
  FORBIDDEN_FOLDERS,
} from "../config";
import { emiliaError } from "../core/emiliaError";
import type { FolderCheckResult, IFileValidator, Result } from "../types";
//FIXME: RXJS POWAR
export class ValidateFile implements IFileValidator {
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
  public async validateFileOperation(filePath: string): Promise<Observable<Result<void>>> {
    const checkResult = await this.checkFormatFile(filePath);
    if (!checkResult.success) return of(checkResult);

    return from(this.checkFolder(filePath)).pipe(
      map((existsResult) => {
        if (!existsResult.exists) {
          return {
            success: false as const,
            error: {
              code: ErrorCode.FILE_NOT_FOUND,
              message: `File ${filePath} does not exist!`,
            },
          };
        }
        if (!existsResult.writable) {
          return {
            success: false as const,
            error: {
              code: ErrorCode.FILE_NOT_WRITABLE,
              message: `File ${filePath} is not writable!`,
            },
          };
        }
        return { success: true as const, data: undefined };
      })
    );
  }

  /**
   * Validates if the file path meets all restrictions.
   * @param {string} filePath - Path to validate
   * @returns {Observable<boolean>} - True if valid
   * @throws {EmiliaError}
   * - `ErrorCode.INVALID_PATH` if path is empty
   * - `ErrorCode.FILE_FORMAT_ERROR` if config is empty
   *
   * @example
   * // Returns true for valid path
   * isValidPath("src/utils/validFile.ts").subscribe(result => {
   *   console.log(result);
   * });
   *
   * // Throws for empty path
   * isValidPath("").subscribe({
   *   next: result => console.log(result),
   *   error: err => console.error(err),
   * });
   */
  public isValidPath(filePath: string): Observable<boolean> {
    return from(this.validateConfig(filePath)).pipe(
      switchMap(() =>
        combineLatest([
          this.isExtensionValid(filePath),
          this.isFolderValid(filePath),
          this.isFileValid(filePath),
        ])
      ),
      map(
        ([isExtensionValid, isFolderValid, isFileValid]) =>
          isExtensionValid && isFolderValid && isFileValid
      )
    );
  }

  /**
   * Validates the configuration for file operations.
   *
   * Ensures that the provided file path is not empty and checks that the configuration arrays for forbidden and allowed
   * extensions, folders, and files are not empty. Throws an error if any of these conditions are not met.
   *
   * @param {string} filePath - The file path to validate.
   * @returns {Observable<void>} - An observable that emits void and throws an error if the validation fails.
   */
  private validateConfig(filePath: string): Observable<void> {
    return from(
      Promise.resolve()
        .then(() => {
          if (!filePath) {
            throw emiliaError("File path is empty!", ErrorCode.INVALID_PATH, "InternalError");
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
              "InternalError"
            );
          }
        })
        .catch((err) => {
          throw err;
        })
    ).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }

  /**
   * Checks if the given file path has a valid extension.
   *
   * Returns an observable that emits true if the file path has a valid extension, otherwise false.
   *
   * @param {string} filePath - The file path to check.
   * @returns {Observable<boolean>} - An observable that emits true or false.
   */
  private isExtensionValid(filePath: string): Observable<boolean> {
    const isForbidden = FORBIDDEN_EXTENSIONS.some((ext) => filePath.endsWith(ext));
    const isAllowed = ALLOWED_EXTENSIONS.some((ext) => filePath.endsWith(ext));

    return of(!isForbidden && isAllowed);
  }

  /**
   * Checks if the given file path is in a valid folder.
   *
   * Returns an observable that emits true if the file path is in a valid folder, otherwise false.
   *
   * @param {string} filePath - The file path to check.
   * @returns {Observable<boolean>} - An observable that emits true or false.
   */
  private isFolderValid(filePath: string): Observable<boolean> {
    const isNotForbidden = !FORBIDDEN_FOLDERS.some((folder) => filePath.includes(folder));
    const isAllowed =
      ALLOWED_FOLDERS.length === 0
        ? true
        : ALLOWED_FOLDERS.some((folder) => filePath.includes(folder));

    return of(isNotForbidden && isAllowed);
  }

  private isFileValid(filePath: string): Observable<boolean> {
    const isForbiddenFile = FORBIDDEN_FILES.some((file) => filePath.includes(file));
    const isAllowedFile =
      ALLOWED_FILES.length === 0 ? true : ALLOWED_FILES.some((file) => filePath.includes(file));

    return of(!isForbiddenFile && isAllowedFile);
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
  public async checkFormatFile(filePath: string): Promise<Result<void>> {
    const isForbidden = FORBIDDEN_EXTENSIONS.some((ext) => filePath.endsWith(ext));
    const isAllowed = ALLOWED_EXTENSIONS.some((ext) => filePath.endsWith(ext));

    return isForbidden && !isAllowed
      ? {
          success: false,
          error: {
            code: ErrorCode.FILE_FORMAT_ERROR,
            message: "FileHandler: You cannot modify a file with this extension!",
          },
        }
      : { success: true, data: undefined };
  }

  async checkFolder(path: string): Promise<FolderCheckResult> {
    if (!this.isValidPath(path)) {
      return Promise.resolve({
        exists: false,
        writable: false,
        error: {
          code: ErrorCode.INVALID_PATH,
          message:
            "You checked folder with black list folders! Please - see at allow/deny folders on config file.",
        },
      });
    }

    return lastValueFrom(
      from(access(resolve(path), constants.F_OK | constants.W_OK)).pipe(
        map(() => ({
          exists: true,
          writable: true,
          error: undefined,
        })),
        catchError((e) => {
          emiliaError(e, ErrorCode.FOLDER_INVALID);
          return of({
            exists: false,
            writable: false,
            error: {
              code: ErrorCode.FOLDER_INVALID,
              message:
                "Folder does not exist or is not writable! Please check the folder path and permissions.",
            },
          });
        })
      )
    );
  }
}
