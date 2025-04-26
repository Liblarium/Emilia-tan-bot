import type { Observable } from "rxjs";

export interface IFolderScanner {
  /**
   * Scans the specified folder and sub-folders.
   * @param folder The folder to scan. If not specified, the root folder will be scanned.
   */
  scan(folder?: string): Observable<string[]>;
}