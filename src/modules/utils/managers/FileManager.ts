import { constants, access, appendFile, mkdir, unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { AbstractEmiliaError } from "@abstract/EmiliaAbstractError";
import { ErrorCode } from "@enum/errorCode";
import type {
  ArrayNotEmpty,
  ClassWithValidator,
  IFileManager,
  IFileValidator,
  Result
} from "@type";
import { validateFileOperation } from "@utils/decorators/validateFileOperation";
import { emiliaError } from "@utils/error/EmiliaError";
import { catchError, from, map, type Observable, of, switchMap } from "rxjs";


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
   * @returns {Observable<CreateFolderResult>}
   * @example
   * FileHandler.createFolder("/path/to/folder", "newFolder")
   *   .subscribe({
   *     next: result => {
   *       if (result.success) {
   *         console.log(`Folder created: ${result.data.path}`);
   *       } else {
   *         console.error(result.error);
   *       }
   *     },
   *     error: err => console.error(err),
   *   });
   */
  createFolder(path: string, folderName: string): Observable<Result<{ path: string }>> {
    if (!path || !folderName) {
      return of({
        success: false as const,
        error: {
          code: ErrorCode.CREATE_FOLDER_ERROR,
          message: "Invalid path or folder name",
        },
      });
    }

    const fullPath = resolve(path, folderName);

    return from(this.fileValidator.checkFolder(fullPath)).pipe(
      switchMap((isFolderValid): Observable<Result<{ path: string }>> => {
        if (!isFolderValid) {
          return of({
            success: false as const,
            error: {
              code: ErrorCode.CREATE_FOLDER_ERROR,
              message: `Invalid path or folder name: ${fullPath}. Maybe this path/folder is on the blacklist or exists/not writable!`,
            },
          });
        }

        return from(mkdir(fullPath, { recursive: true })).pipe(
          map(() => ({
            success: true as const,
            data: { path: fullPath },
          }))
        );
      }),
      catchError((e): Observable<Result<{ path: string }>> => {
        const errorMessage = e instanceof AbstractEmiliaError ? e.message : "Unknown error";
        const errorCode = e instanceof AbstractEmiliaError && e.code.length > 0 ? e.code : ErrorCode.CREATE_FOLDER_ERROR;
        emiliaError(errorMessage, errorCode);

        return of({
          success: false as const,
          error: {
            code: errorCode,
            message: `Failed to create folder: ${errorMessage}`,
          },
        });
      })
    );
  }

  /**
   * Method for writing a file using RxJS.
   * @param {string} filePath - Path to the file
   * @param {string} data - Data to write
   * @returns {Observable<Result<void>>}
   * @example
   * FileHandler.writeFile("/path/to/file.txt", "Hello, world!")
   *   .subscribe({
   *     next: result => {
   *       if (result.success) {
   *         console.log("File written successfully");
   *       } else {
   *         console.error(result.error);
   *       }
   *     },
   *     error: err => console.error(err),
   *   });
   */
  @validateFileOperation()
  writeFile(filePath: string, data: string): Observable<Result<void>> {
    return from(writeFile(filePath, data)).pipe(
      map(() => ({ success: true as const, data: undefined })),
      catchError(e => {
        const errorMessage = e instanceof AbstractEmiliaError ? e.message : "Unknown error";
        emiliaError(`FileHandler.writeFile: ${errorMessage}`, ErrorCode.FILE_NOT_WRITABLE);
        console.error(e);

        return of({
          success: false as const,
          error: { code: ErrorCode.FILE_NOT_WRITABLE, message: `Failed to write file: ${errorMessage}` }
        });
      })
    );
  }

  /**
   * Deletes a file by the given name using RxJS.
   * @param {string} fileName - Name of the file to delete
   * @returns {Observable<Result<void>>}
   * @example
   * FileHandler.deleteFile("path/to/file.txt")
   *   .subscribe({
   *     next: result => {
   *       if (result.success) {
   *         console.log("File deleted successfully");
   *       } else {
   *         console.error(result.error);
   *       }
   *     },
   *     error: err => console.error(err),
   *   });
   */
  @validateFileOperation<ClassWithValidator>()
  deleteFile(fileName: string): Observable<Result<void>> {
    return from(unlink(fileName)).pipe(
      map(() => ({ success: true as const, data: undefined })),
      catchError(e => {
        const errorMessage = e instanceof AbstractEmiliaError ? e.message : "Unknown error";
        emiliaError(`FileHandler.deleteFile: ${errorMessage}`, ErrorCode.FILE_NOT_WRITABLE);
        console.error(e);

        return of({
          success: false as const,
          error: { code: ErrorCode.FILE_NOT_WRITABLE, message: `Failed to delete file: ${errorMessage}!` },
        });
      })
    );
  }

  /**
   * Appends the given data to the specified file using RxJS.
   * 
   * This function will append the data to the file if it is writable.
   * It handles errors gracefully and returns an observable with the result.
   * 
   * @param {string} fileName - The path to the file to append data to.
   * @param {string} data - The data to append to the file.
   * @returns {Observable<Result<void>>} - An observable that emits the result of the append operation.
   * 
   * @example
   * FileHandler.appendFile("path/to/file.txt", "some data")
   *   .subscribe({
   *     next: result => {
   *       if (result.success) {
   *         console.log("File appended successfully");
   *       } else {
   *         console.error(result.error);
   *       }
   *     },
   *     error: err => console.error(err),
   *   });
   */
  @validateFileOperation<ClassWithValidator>()
  appendFile(fileName: string, data: string): Observable<Result<void>> {
    return from(this.fileValidator.validateFileOperation(fileName) as Promise<Result<void>>).pipe(
      switchMap((validation: Result<void>): Observable<Result<void>> => {
        if (!validation.success) {
          return of({ success: false as const, error: validation.error });
        }

        return from(access(fileName, constants.W_OK)).pipe(
          catchError(e => {
            const errorMessage = e instanceof AbstractEmiliaError ? e.message : "Unknown error";
            emiliaError(`FileHandler.appendFile: ${errorMessage}`, ErrorCode.APPEND_FILE_ERROR);
            console.error(e);

            return of({
              success: false as const,
              error: { code: ErrorCode.APPEND_FILE_ERROR, message: `Failed to append data to file: ${errorMessage}` },
            });
          }),
          switchMap(() => from(appendFile(fileName, data)).pipe(
            map(() => ({ success: true as const, data: undefined })),
            catchError(e => {
              const errorMessage = e instanceof AbstractEmiliaError ? e.message : "Unknown error";
              emiliaError(`FileHandler.appendFile: ${errorMessage}`, ErrorCode.APPEND_FILE_ERROR);
              console.error(e);

              return of({
                success: false as const,
                error: { code: ErrorCode.APPEND_FILE_ERROR, message: `Failed to append data to file: ${errorMessage}` },
              });
            })
          ))
        );
      })
    );
  }
}


