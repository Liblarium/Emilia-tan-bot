import { constants, access, appendFile, mkdir, unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Enums } from "@constants";
import type { ArrayNotEmpty } from "@type";
import type { ClassWithValidator, Result } from "@type/utils/file";
import type { IFileManager } from "@type/utils/fileManager";
import type { IFileValidator } from "@type/utils/fileValidator";
import { Decorators, emiliaError } from "@utils";

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
   * console.log(result);
   * // {
   * //   success: true,
   * //   path: "/path/to/folder/newFolder"
   * // }
   */
  @Decorators.logCaller()
  async createFolder(
    path: string,
    folderName: string,
  ): Promise<Result<{ path: string }>> {
    if (!path || !folderName)
      return { success: false, error: { code: Enums.ErrorCode.INVALID_PATH, message: "Invalid path or folder name!" } };

    const pathFolder = resolve(path);
    const folder = resolve(pathFolder, folderName);

    try {
      await access(pathFolder, constants.W_OK);
      await mkdir(folder, { recursive: true });
      return {
        success: true,
        data: { path: folder },
      };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      emiliaError(errorMessage, Enums.ErrorCode.CREATE_FOLDER_ERROR);
      return {
        success: false,
        error: { code: Enums.ErrorCode.CREATE_FOLDER_ERROR, message: `Failed to create folder: ${errorMessage}` },
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
  @Decorators.logCaller()
  @Decorators.validateFileOperation()
  async writeFile(filePath: string, data: string): Promise<Result<void>> {
    try {
      await writeFile(filePath, data);
      return { success: true, data: undefined };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      emiliaError(`FileHandler.writeFile: ${errorMessage}`, Enums.ErrorCode.FILE_NOT_WRITABLE);
      console.error(e);
      return {
        success: false,
        error: { code: Enums.ErrorCode.FILE_NOT_WRITABLE, message: `Failed to write file: ${errorMessage}` },
      };
    }
  }

  /**
   * Deletes a file by the given name.
   * @param {string} fileName - Name of the file to delete
   * @returns {Promise<DeleteFileResult>}
   * @example
   * const result = await FileHandler.deleteFile("path/to/file.txt");
   * console.log(result);
   * // {
   * //   success: true,
   * //   error: undefined
   * // }
   */
  @Decorators.logCaller()
  @Decorators.validateFileOperation<ClassWithValidator>()
  async deleteFile(fileName: string): Promise<Result> {
    try {
      const filePath = resolve(fileName);

      await unlink(filePath);

      return { success: true, data: undefined };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      emiliaError(`FileHandler.deleteFile: ${errorMessage}`, Enums.ErrorCode.FILE_NOT_WRITABLE);
      console.error(e);
      return {
        success: false,
        error: { code: Enums.ErrorCode.FILE_NOT_WRITABLE, message: `Failed to delete file: ${errorMessage}!` },
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
  @Decorators.logCaller()
  @Decorators.validateFileOperation<ClassWithValidator>()
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
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      emiliaError(`FileHandler.appendFile: ${errorMessage}`, Enums.ErrorCode.APPEND_FILE_ERROR);
      console.error(e);
      return {
        success: false,
        error: { code: Enums.ErrorCode.APPEND_FILE_ERROR, message: `Failed to append data to file: ${errorMessage}` },
      };
    }
  }
}
