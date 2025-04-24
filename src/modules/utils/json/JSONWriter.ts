import { ErrorCode } from "@enum/errorCode";
import type { IFileManager, IFileValidator, IJSONWriter, Result } from "@type";
import { objectToString } from "@utils/formatters/objectToString";
import { Observable } from "rxjs";


export class JSONWriter implements IJSONWriter {
  constructor(
    public readonly fileValidator: IFileValidator,
    public readonly fileManager: IFileManager,
  ) { }

  /**
   * Writes the given JSON data to the specified file.
   *
   * If the file is a .json file, the file will be overwritten.
   * 
   * If the file is not a .json file, an error will be returned. Use {@link JSONWriter.appendLine} to append data to the file.
   *
   * @param {string} filePath - The path to the file.
   * @param {T} data - The JSON data to write.
   * @returns {Observable<Result<void>>} - A Observable that resolves with a result object that contains a success flag and a data field or an error field.
   */
  writeFile<T extends object>(filePath: string, data: T): Observable<Result<void>> {
    return this.appendFileLogic(filePath, data);
  }

  /**
   * Appends a line of JSON data to the specified file.
   *
   * If the file is a .json file, the delimiter will not be appended.
   * 
   * If the file is not a .json file, the delimiter will be appended after the data.
   *
   * @param filePath - The path to the file where the data should be appended.
   * @param data - The JSON data to append to the file.
   * @param delimiter - The delimiter to use between entries. Default is "\n".
   * @returns A Observable that resolves with a result object indicating the success or failure of the operation.
   */
  appendLine<T extends object>(
    filePath: string,
    data: T,
    delimiter: string = "\n",
  ): Observable<Result<void>> {
    return this.appendFileLogic(filePath, data, delimiter);
  }

  /**
   * This method is used by writeFile and appendLine methods.
   * It append given data to the file. If the file is a .json file, it will not append the delimiter.
   * If the file is not a .json file, it will append the delimiter before the data.
   * @param {string} filePath - The path to the file.
   * @param {T} data - The data to append.
   * @param {string} [delimiter] - The delimiter to use. If the delimiter is given and the file is a .json file, an error will be returned.
   * @returns {Observable<Result<void>>} - An observable that emits a result object that contains a success flag and a data field or an error field.
   * @private
   */
  private appendFileLogic<T extends object>(
    filePath: string,
    data: T,
    delimiter?: string,
  ): Observable<Result<void>> {
    return new Observable<Result<void>>(observer => {
      if (this.fileValidator.isJSONFile(filePath)) {
        if (delimiter) {
          observer.next({
            success: false,
            error: {
              code: ErrorCode.WRONG_DELIMITER,
              message: "Why you use delimiter on .json file? Use writeFile method for .json files",
            }
          });
          observer.complete();
          return;
        }

        // convert object data to string
        const jsonData = this.stringify<T>(data);

        // if conversion fails, emit error
        if (!jsonData.success) {
          observer.next({ success: false, error: jsonData.error });
          observer.complete();
          return;
        }

        // for .json: overwrite the entire file
        this.fileManager.writeFile(filePath, jsonData.data).subscribe({
          next: () => {
            observer.next({ success: true, data: undefined });
            observer.complete();
          },
          error: (error) => {
            observer.next({ success: false, error });
            observer.complete();
          }
        });
        return;
      }

      // if the file is not a .json file and delimiter is given - append the delimiter or use "\n"
      const separator = delimiter?.trim() ? delimiter : "\n";
      // convert object data to string
      const jsonData = this.stringify(data);

      if (!jsonData.success) {
        observer.next(jsonData);
        observer.complete();
        return;
      }

      this.fileManager.appendFile(filePath, jsonData.data + separator).subscribe({
        next: (() => {
          observer.next({ success: true, data: undefined });
          observer.complete();
        }),
        error: (error => {
          observer.next({ success: false, error });
          observer.complete();
        })
      })
    });
  }

  /**
   * Converts an object to a JSON string.
   * @template T - The type of the object to stringify.
   * @param data - The object to convert to a JSON string.
   * @param pretty - Whether to format the JSON string with indentation. Default is `false`.
   * @returns A `Result` object containing the JSON string if successful, or an error message if the conversion fails.
   */
  stringify<T extends object = object>(
    data: T,
    pretty: boolean = false,
  ): Result<string> {
    return objectToString(data, pretty);
  }
}
