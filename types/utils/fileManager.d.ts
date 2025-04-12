import type { ClassWithValidator, Result } from ".";

export interface IFileManager extends ClassWithValidator {
  /**
   * Creates a folder at the given path with the given folder name.
   * @param path - The path to the folder.
   * @param folderName - The name of the folder to create.
   * @returns A promise that resolves to a result. The result will contain the path of the created folder.
   * @example
   * const result = await fileManager.createFolder("path/to/folder", "myFolder");
   * console.log(result); // { success: true, data: { path: "path/to/folder/myFolder" } }
   */
  createFolder(
    path: string,
    folderName: string,
  ): Promise<Result<{ path: string }>>;

  /**
   * Deletes a file at the given path.
   * @param fileName - The name of the file to delete.
   * @returns A promise that resolves to a result. The result will contain the path of the deleted file.
   */
  deleteFile(fileName: string): Promise<Result<void>>;

  /**
   * Appends the given data to the file at the given path.
   * @param fileName - The name of the file to append to.
   * @param data - The data to append.
   * @returns A promise that resolves to a result. The result will contain the path of the file that was appended to.
   */
  appendFile(fileName: string, data: string): Promise<Result<void>>;

  /**
   * Writes the given data to the file at the given path.
   * @param filePath - The path to the file.
   * @param data - The data to write.
   * @returns A promise that resolves to a result. The result will contain the path of the file that was written to.
   */
  writeFile(filePath: string, data: string): Promise<Result<void>>;
}
