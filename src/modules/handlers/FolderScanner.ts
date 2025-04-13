import { resolve } from "node:path";
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
   * @returns A promise that resolves with an array of file paths that match the given filter.
   */
  async scan(folder?: string): Promise<string[]> {
    const path = [...this.folderPath];

    if (folder) path.push(folder);

    const fullPath = resolve(...path);
    const files = await glob(`${fullPath}/*`);

    return files.filter((file) => this.filterFile.test(file));
  }
}
