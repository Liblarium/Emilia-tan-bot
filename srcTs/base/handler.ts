import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import type { ArrayPathLimit, IBaseHandler, ModuleType } from "../../types/base/handler";
import type { EmiliaClient } from "../client";
import { Log } from "../log";
import { EmiliaTypeError, isClass } from "../utils";

export class BaseHandler implements IBaseHandler {
  client: EmiliaClient;
  folderPath: ArrayPathLimit;
  filterFile: RegExp;

  constructor(client: EmiliaClient) {
    this.client = client;
    this.folderPath = ["srcJs", "сommands"];
    this.filterFile = /^[^.]+\.(js)$/;
  }

  /**
   * Метод для изменения фильтра
   * @param filter
   * @default /^[^.]+\.(js)$/
   */
  setFilter(filter: RegExp): void | Promise<void> {
    if (typeof filter === "symbol") this.filterFile;
  }

  /**
   * Метод для изменения пути поиска
   * @param path
   * @default [`src`,`command`]
   */
  setFolderPath(path: ArrayPathLimit): void {
    if (path) this.folderPath = path;
  }

  setLogic(modules: ModuleType): void | null | Promise<void> {
    modules;
    throw new EmiliaTypeError("Вы не реализовали setLogic!");
  }

  async build(): Promise<void> {
    const folders = resolve(...this.folderPath);
    const foldersScan = await readdir(folders);

    try {
      for (const folder of foldersScan) {
        const files = resolve(folders, folder);
        const fileScan = (await readdir(files)).filter((file) => this.filterFile.test(file));

        for (const file of fileScan) {
          const importModule = await import(`../${this.folderPath[1]}/${folder}/${file}`) as { default: { default: unknown } };
          const FileModule: unknown = importModule.default.default;

          if (!isClass(FileModule)) {
            new Log({ text: `Файл ${file} не является классом!`, type: "error", categories: ["global", "handler"] });
            continue;
          }

          /* biome-ignore lint/suspicious/noExplicitAny: <explanation> */ //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
          const modules: ModuleType = new (FileModule as any)();
          const logic = await this.setLogic(modules);

          if (logic === null) continue;
        }
      }
    } catch (e: unknown) {
      new Log({ text: (e as Error).message, type: "error", categories: ["global", "handler"] });
    }
  }
}
