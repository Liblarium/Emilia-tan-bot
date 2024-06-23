import { ArrayPathLimit, IBaseHandler, ModuleType } from "../../types/base/handler";
import { EmiliaTypeError, isClass } from "../utils";
import { EmiliaClient } from "../client";
import { readdir } from "fs/promises";
import { resolve } from "path";
import { Log } from "../log";

export class BaseHandler implements IBaseHandler {
  client: EmiliaClient;
  folderPath: ArrayPathLimit;
  filterFile: RegExp;

  constructor(client: EmiliaClient) {
    this.client = client;
    this.folderPath = [`srcJs`, `сommands`];
    this.filterFile = /^[^.]+\.(js)$/;
  }

  /**
   * Метод для изменения фильтра
   * @param {RegExp} filter
   * @default /^[^.]+\.(js)$/
   */
  setFilter(filter: RegExp): void {
    if (filter) this.filterFile;
  }

  /**
   * Метод для изменения пути поиска
   * @param {ArrayPathLimit} path
   * @default [`src`,`command`]
   */
  setFolderPath(path: ArrayPathLimit): void {
    if (path) this.folderPath = path;
  }

  setLogic(modules: ModuleType): void | null | Promise<void | null> {
    throw new EmiliaTypeError(`Вы не реализовали setLogic!`);
  }

  async build(): Promise<void> {
    const folders = resolve(...this.folderPath);
    const foldersScan = await readdir(folders);

    try {
      for (const folder of foldersScan) {
        const files = resolve(folders, folder);
        const fileScan = (await readdir(files)).filter((file) => this.filterFile.test(file));

        for (const file of fileScan) {
          const importModule = await import(`../${this.folderPath[1]}/${folder}/${file}`);
          const FileModule = importModule.default.default;

          if (!isClass(FileModule)) {
            new Log({ text: `Файл ${file} не является классом!`, type: `error`, categories: [`global`, `handler`] });
            continue;
          }

          const modules: ModuleType = new FileModule();
          const logic = await this.setLogic(modules);

          if (logic === null) continue;
        }
      }
    } catch (e) {
      new Log({ text: e, type: `error`, categories: [`global`, `handler`] });
    }
  }
}
