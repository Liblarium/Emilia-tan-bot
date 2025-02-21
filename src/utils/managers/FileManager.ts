import { constants, access, appendFile, mkdir, unlink } from "node:fs/promises";
import { resolve } from "node:path";
import type { ArrayNotEmpty } from "@type";
import type { ClassWithValidator, Result } from "@type/utils/file";
import type { IFileManager } from "@type/utils/fileManager";
import type { IFileValidator } from "@type/utils/fileValidator";
import { Decorators, emiliaError } from "@utils";

export class FileManager implements IFileManager {
  /**
   * Instance of file validator
   */
  public readonly fileValidator: IFileValidator;

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
  constructor(fileValidator: IFileValidator) {
    this.fileValidator = fileValidator;
  }
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
      return { success: false, error: "Invalid path or folder name!" };

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
      emiliaError(errorMessage);
      return {
        success: false,
        error: `Failed to create folder: ${errorMessage}`,
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

      return { success: true };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      emiliaError(`FileHandler.deleteFile: ${errorMessage}`);
      console.error(e);
      return {
        success: false,
        error: `Failed to delete file: ${errorMessage}!`,
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
  async appendFile(fileName: string, data: string): Promise<Result> {
    try {
      const filePath = resolve(fileName);

      const validation =
        await this.fileValidator.validateFileOperation(filePath);
      if (!validation.success)
        return { success: false, error: validation.error };

      await access(filePath, constants.W_OK);
      await appendFile(filePath, data);

      return { success: true };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      emiliaError(`FileHandler.appendFile: ${errorMessage}`);
      console.error(e);
      return {
        success: false,
        error: `Failed to append data to file: ${errorMessage}`,
      };
    }
  }
}
