import { constants, access, appendFile, mkdir, unlink } from "node:fs/promises";
import { resolve } from "node:path";
import { emiliaError } from "@utils";
import { AppendFileResult, CreateFolderResult, DeleteFileResult, FolderCheckResult, CheckFormatFileResult } from "@type/handler";

export class FileHandler {
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
  static async createFolder(path: string, folderName: string): Promise<CreateFolderResult> {
    if (!path || !folderName) return { success: false, error: "Invalid path or folder name!" };

    const pathFolder = resolve(path);
    const folder = resolve(pathFolder, folderName);

    try {
      await access(pathFolder, constants.W_OK);
      await mkdir(folder, { recursive: true });
      return {
        success: true,
        path: folder
      };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      emiliaError(errorMessage);
      return {
        success: false,
        error: `Failed to create folder: ${errorMessage}`
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
  static async deleteFile(fileName: string): Promise<DeleteFileResult> {
    try {
      const filePath = resolve(fileName);

      const checkResult = this.checkFormatFile(filePath, "delete");
      if (!checkResult.success) return {
        success: false,
        error: checkResult.error
      };

      await unlink(filePath);

      return { success: true };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      emiliaError(`FileHandler.deleteFile: ${errorMessage}`);
      console.error(e);
      return {
        success: false,
        error: `Failed to delete file: ${errorMessage}!`
      };
    }
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
  static async checkFolder(path: string): Promise<FolderCheckResult> {
    try {
      const patchFolder = resolve(path);
      await access(patchFolder, constants.F_OK | constants.W_OK);
      return {
        exists: true,
        writable: true
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

  /**
   * Checks if the given file has a forbidden extension and not allowed extension.
   * @param {string} filePath - Path to the file
   * @param {string} choise - "create" or "delete"
   * @returns {CheckFormatFileResult} result of the check
   * @example
   * const result = FileHandler.checkFormatFile("path/to/file.txt", "create");
   * console.log(result);
   * // { success: true }
   */
  private static checkFormatFile(filePath: string, choise: string): CheckFormatFileResult {
    const forbiddenExtensions = [".js", ".ts", ".d.ts", ".json"];
    const allowedExtensions = [".txt", ".log"];

    if (forbiddenExtensions.some(ext => filePath.endsWith(ext)) && !allowedExtensions.some(ext => filePath.endsWith(ext))) {
      return { success: false, error: `FileHandler.${choise}File: You cannot ${choise} a file with this extension!` };
    }

    return { success: true };
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
  static async appendFile(fileName: string, data: string): Promise<AppendFileResult> {
    try {
      const filePath = resolve(fileName);

      const checkResult = this.checkFormatFile(filePath, "append");
      if (!checkResult.success) return {
        success: false,
        error: checkResult.error
      };

      await access(filePath, constants.W_OK);
      await appendFile(filePath, data);

      return { success: true };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      emiliaError(`FileHandler.appendFile: ${errorMessage}`);
      console.error(e);
      return {
        success: false,
        error: `Failed to append data to file: ${errorMessage}`
      };
    }
  }
}