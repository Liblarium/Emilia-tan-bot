import type { Observable } from "rxjs";
import type { ClassWithValidator, Result } from ".";

export interface FileManagerInterface extends ClassWithValidator {
  /**
   * Creates a folder at the given path with the given folder name.
   * @param path - The path to the folder.
   * @param folderName - The name of the folder to create.
   * @returns A Observable that resolves to a result. The result will contain the path of the created folder.
   * @example
   * const result = await fileManager.createFolder("path/to/folder", "myFolder");
   * console.log(result); // { success: true, data: { path: "path/to/folder/myFolder" } }
   */
  createFolder(path: string, folderName: string): Observable<Result<{ path: string }>>;

  /**
   * Deletes a file at the given path.
   * @param fileName - The name of the file to delete.
   * @returns A Observable that resolves to a result. The result will contain the path of the deleted file.
   */
  deleteFile(fileName: string): Observable<Result<void>>;

  /**
   * Appends the given data to the file at the given path.
   * @param fileName - The name of the file to append to.
   * @param data - The data to append.
   * @returns A Observable that resolves to a result. The result will contain the path of the file that was appended to.
   */
  appendFile(fileName: string, data: string): Observable<Result<void>>;

  /**
   * Writes the given data to the file at the given path.
   * @param filePath - The path to the file.
   * @param data - The data to write.
   * @returns A Observable that resolves to a result. The result will contain the path of the file that was written to.
   */
  writeFile(filePath: string, data: string): Observable<Result<void>>;
}
