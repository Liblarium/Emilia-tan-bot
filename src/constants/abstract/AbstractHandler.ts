import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import type { EmiliaClient } from "@client";
import type { ArrayMaybeEmpty, ArrayPathLimit } from "@type";
import { Checkers, Decorators } from "@utils";
import { ModuleType } from "@type/handler";
import { Log } from "@log";



export abstract class AbstractHandler {
  /**
   * The client which the handler is attached to.
   */
  public client: EmiliaClient;
  /**
   * The path to the folder where the handler will look for files.
   * @default ["dist","command"]
   */
  protected folderPath: ArrayPathLimit;
  /**
   * The regular expression used to filter the files in the folder.
   * @default /^[^.]+\.(js)$/
   */
  protected filterFile: RegExp;

  /**
   * The constructor for the handler class.
   * @param client - The client which the handler is attached to.
   * 
   * The handler will look for files in the "dist/command" directory and will filter them by the regular expression `^[^.]+\.(js)$`.
   */
  constructor(client: EmiliaClient) {
    this.client = client;
    this.folderPath = ["dist", "command"];
    this.filterFile = /^[^.]+\.(js)$/;
  }

  /**
   * Method to change the filter
   * @param filter
   * @default /^[^.]+\.(js)$/
   */
  public setFilter(filter: RegExp): void | Promise<void> {
    if (filter instanceof RegExp) this.filterFile = filter;
  }

  /**
   * Method to change the path for searching
   * @param path
   * @default ["dist","command"]
   * @returns {void}
   */
  public setFolderPath(path: ArrayPathLimit): void | null | Promise<void | null> {
    if (path) this.folderPath = path;
  }

  /** 
   * Method for working with commands/events
   * @param folder
   * @param file
   * @returns {Promise<ModuleType>}
  */
  protected abstract setLogic(modules: ModuleType): void | null | Promise<void | null>;

  /**
   * Build method for the handler class.
   *
   * This method will look for folders in the directory specified by the `folderPath` property.
   * 
   * It will then look for files in each of those folders and filter them by the regular expression specified by the `filterFile` property.
   * 
   * It will then import each of the filtered files and check if they are classes.
   * 
   * If they are, it will create an instance of the class and pass it to the `setLogic` method.
   * 
   * If the `setLogic` method returns `null`, it will skip the file.
   * 
   * If any errors occur during the build process, it will log the error.
   */
  @Decorators.logCaller()
  protected async build(): Promise<void> {
    const foldersScan = await this.scanFolder();

    try {
      for (const folder of foldersScan) {
        const fileScan = (await this.scanFolder(folder)).filter((file) => this.filterFile.test(file));

        for (const file of fileScan) {
          const FileModule = (await this.importModule(folder, file)).default.default;

          if (!Checkers.isClass(FileModule)) {
            new Log({ text: `Файл ${file} не является классом!`, type: 2, categories: ["global", "handler"] });
            continue;
          }

          const modules: ModuleType = new FileModule();
          const logic = await this.setLogic(modules);
          // TODO: delete this Log later. Now - for debug
          new Log({ text: `Модуль ${file} успешно загружен!`, type: 1, categories: ["global", "handler"] });

          if (logic === null) continue;
        }
      }
    } catch (e: unknown) {
      new Log({ text: e, type: 2, categories: ["global", "handler"] });
    }
  }

  /**
   * Method for scanning the specified folder and sub-folders
   * @param folder
   * @returns
   */
  private async scanFolder(): Promise<ArrayMaybeEmpty<string>>;
  private async scanFolder(folder: string): Promise<ArrayMaybeEmpty<string>>;
  private async scanFolder(folder?: string): Promise<ArrayMaybeEmpty<string>> {
    const folderPach = this.folderPath;

    if (folder && folder.length >= 1) folderPach.push(folder);

    const folders = resolve(...this.folderPath);

    return await readdir(folders);
  }

  /**
   * Imports a module from the specified folder and file.
   * 
   * Constructs the full path to the module using the folderPath property,
   * and then dynamically imports the module.
   * 
   * @param folder - The folder where the file is located.
   * @param file - The file to import from the specified folder.
   * @returns The default export of the imported module.
   */
  private async importModule(folder: string, file: string) {
    const modulePath = resolve(...this.folderPath, folder, file);
    const importModule = await import(modulePath);

    return importModule.default.default;
  }
}
