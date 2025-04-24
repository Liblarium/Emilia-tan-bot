import { resolve } from "node:path";
import { type Observable, from, map } from "rxjs";
import type { HandlerPath, IFolderScanner } from "@type";
import { glob } from "glob";

export class FolderScanner implements IFolderScanner {
  constructor(
    private folderPath: HandlerPath,
    private filterFile: RegExp,
  ) { }

  /**
   * Scans the specified folder and sub-folders.
   *
   * @param folder The folder to scan. If not specified, the root folder will be scanned.
   *
   * If need more information - see at IFolderScanner
   * 
   * @returns An observable that emits an array of file paths that match the given filter.
   */
  scan(folder?: string): Observable<string[]> {
    const path = [...this.folderPath];

    if (folder) path.push(folder);

    const fullPath = resolve(...path);

    return from(glob(`${fullPath}/*`)).pipe(
      map((files: string[]) => files.filter((file: string) => this.filterFile.test(file)))
    );
  }
}

