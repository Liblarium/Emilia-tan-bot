import { constants, access, appendFile, mkdir, unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { AbstractEmiliaError } from "@constants/abstract/EmiliaAbstractError";
import { ErrorCode } from "@constants/enum/errorCode";
import type { ArrayNotEmpty } from "@type";
import type { ClassWithValidator, Result } from "@type/utils";
import type { IFileManager } from "@type/utils/fileManager";
import type { IFileValidator } from "@type/utils/fileValidator";
//import { logCaller } from "@utils/decorators/logCaller";
import { validateFileOperation } from "@utils/decorators/validateFileOperation";
import { emiliaError } from "@utils/error/EmiliaError";


export class FileManager implements IFileManager {
  public readonly logCategories: ArrayNotEmpty<string> = ["fileManager"];

  /**
   * Constructor for file manager.
   *
   * @param {IFileValidator} fileValidator - Instance of file validator.
   * @example
   * ```ts
   * const fileValidator = new FileValidator();
   * const fileManager = new FileManager(fileValidator);
   * ```
   */
  constructor(public fileValidator: IFileValidator) { }
  /**
   * Method for create folder
   * @param {string} path - Path to folder
   * @param {string} folderName - Name of folder
   * @returns {Promise<CreateFolderResult>}
   * @example
   * const result = await FileHandler.createFolder("/path/to/folder", "newFolder");
   * 
   * if (!result) return console.error(result.error); // { success: false, error: { code: "CREATE_FOLDER_ERROR" or "INVALID_PATH", message: or "Invalid path or folder name!" } }
   * 
   * console.log(result);
   * // {
   * //   success: true,
   * //   path: "/path/to/folder/newFolder"
   * // }
   */
  //@logCaller()
  async createFolder(
    path: string,
    folderName: string,
  ): Promise<Result<{ path: string }>> {
    if (!path || !folderName)
      return { success: false, error: { code: ErrorCode.INVALID_PATH, message: "Invalid path or folder name!" } };

    const pathFolder = resolve(path);
    const folder = resolve(pathFolder, folderName);

    const [isPathValid, isFolderValid] = [pathFolder, folder].map(async (check) => await this.fileValidator.checkFolder(check));

    if (!(await isPathValid) || !(await isFolderValid)) return {
      success: false, error: {
        code: ErrorCode.CREATE_FOLDER_ERROR,
        message: `Invalid path or folder name: ${folder}. Maybe this path/folder on black list or exist/not writable!`,
      }
    };

    try {

      await mkdir(folder, { recursive: true });
      return {
        success: true,
        data: { path: folder },
      };
    } catch (e) {
      const errorMessage = e instanceof AbstractEmiliaError ? e.message : "Unknown error";
      const errorCode = e instanceof AbstractEmiliaError && e.code.length > 0 ? e.code : ErrorCode.CREATE_FOLDER_ERROR;
      emiliaError(errorMessage, errorCode);

      return {
        success: false,
        error: {
          code: errorCode,
          message: `Failed to create folder: ${errorMessage}`
        }
      };
    }
  }

  /**
   * Method for write file
   * @param {string} filePath - Path to file
   * @param {string} data - Data to write
   * @returns {Promise<WriteFileResult>}
   * @example
   * const result = await FileHandler.writeFile("/path/to/file.txt", "Hello, world!");
   * console.log(result);
   * // {
   * //   success: true,
   * //   data: undefined
   * // }
   */
  //@logCaller()
  @validateFileOperation()
  async writeFile(filePath: string, data: string): Promise<Result<void>> {
    try {
      await writeFile(filePath, data);
      return { success: true, data: undefined };
    } catch (e) {
      const errorMessage = e instanceof AbstractEmiliaError ? e.message : "Unknown error";

      emiliaError(`FileHandler.writeFile: ${errorMessage}`, ErrorCode.FILE_NOT_WRITABLE);
      console.error(e);
      return {
        success: false,
        error: { code: ErrorCode.FILE_NOT_WRITABLE, message: `Failed to write file: ${errorMessage}` },
      };
    }
  }

  /**
   * Deletes a file by the given name.
   * @param {string} fileName - Name of the file to delete
   * @returns {Promise<Result<void>>}
   * @example
   * const result = await FileHandler.deleteFile("path/to/file.txt");
   * console.log(result);
   * // {
   * //   success: true,
   * //   error: undefined
   * // }
   */
  //@logCaller()
  @validateFileOperation<ClassWithValidator>()
  async deleteFile(fileName: string): Promise<Result<void>> {
    try {
      const filePath = resolve(fileName);

      await unlink(filePath);

      return { success: true, data: undefined };
    } catch (e) {
      const errorMessage = e instanceof AbstractEmiliaError ? e.message : "Unknown error";
      emiliaError(`FileHandler.deleteFile: ${errorMessage}`, ErrorCode.FILE_NOT_WRITABLE);
      console.error(e);
      return {
        success: false,
        error: { code: ErrorCode.FILE_NOT_WRITABLE, message: `Failed to delete file: ${errorMessage}!` },
      };
    }
  }

  /**
   * Appends the given data to the given file.
   * @param {string} fileName - Path to the file
   * @param {string} data - Data to append to the file
   * @returns {Promise<AppendFileResult>}
   * @example
   * const result = await FileHandler.appendFile("path/to/file.txt", "some data");
   * console.log(result);
   * // {
   * //   success: true
   * // }
   */
  //@logCaller()
  @validateFileOperation<ClassWithValidator>()
  async appendFile(fileName: string, data: string): Promise<Result<void>> {
    try {
      const filePath = resolve(fileName);

      const validation =
        await this.fileValidator.validateFileOperation(filePath);
      if (!validation.success)
        return { success: false, error: validation.error };

      await access(filePath, constants.W_OK);
      await appendFile(filePath, data);

      return { success: true, data: undefined };
    } catch (e) {
      const errorMessage = e instanceof AbstractEmiliaError ? e.message : "Unknown error";
      emiliaError(`FileHandler.appendFile: ${errorMessage}`, ErrorCode.APPEND_FILE_ERROR);
      console.error(e);
      return {
        success: false,
        error: { code: ErrorCode.APPEND_FILE_ERROR, message: `Failed to append data to file: ${errorMessage}` },
      };
    }
  }
}
