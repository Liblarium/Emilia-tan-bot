import type {
  IAbstractHandlerLogic,
  IHandlerCore,
  ValidModule
} from "@type";
import { isClass } from "@utils/checkers/isClass";
import type { FolderScanner } from "./FolderScanner";
import type { ModuleImporter } from "./ModuleImporter";
import { from, lastValueFrom, mergeMap } from 'rxjs';

export class HandlerCore
  implements IHandlerCore {

  /**
   * Constructs an instance of HandlerCore.
   *
   * @param scanner - The FolderScanner instance used for scanning directories.
   * @param importer - The ModuleImporter instance used for importing modules from the scanned directories.
   */
  constructor(
    private scanner: FolderScanner,
    private importer: ModuleImporter,
  ) { }

  /**
   * Builds the handler by scanning directories, importing modules, and setting up logic for each module.
   *
   * @template T - The type of the module, extending ValidModule.
   * @param handler - The handler logic to apply to each imported module.
   * @returns A promise that resolves when the build process is complete.
   * 
   * @throws Logs an error if a file does not export a class or if any issues occur during scanning or importing.
   */
  async build<T extends ValidModule>(handler: IAbstractHandlerLogic): Promise<void> {
    try {
      const folders$ = this.scanner.scan();

      // We convert the array of folders into a stream and call processFolder for each folder
      await lastValueFrom(folders$.pipe(
        mergeMap((folders) => from(folders)),
        mergeMap((folder) => this.processFolder<T>(folder, handler)),
      ));
    } catch (e: unknown) {
      console.error(e);
    }
  }

  /**
   * Processes a single folder by scanning for files, importing each module, checking if it is a class, and setting the logic for the handler.
   *
   * @param folder - The folder to scan.
   * @param handler - The handler logic to apply to each imported module.
   * @returns A promise that resolves when all files have been processed.
   * 
   * @throws Logs an error if a file does not export a class or if any issues occur during scanning or importing.
   */
  private async processFolder<T extends ValidModule>(folder: string, handler: IAbstractHandlerLogic): Promise<void> {
    const files$ = this.scanner.scan(folder);

    await lastValueFrom(
      files$.pipe(
        mergeMap((files) => from(files)), // Преобразуем массив файлов в поток отдельных файлов
        mergeMap((file) => this.processFile<T>(folder, file, handler)) // Обрабатываем каждый файл
      )
    );
  }

  /**
   * Processes a single file by importing the module, checking if it is a class, and setting the logic for the handler.
   *
   * @param folder - The folder containing the file to import.
   * @param file - The file to import.
   * @param handler - The handler logic to apply to each imported module.
   * 
   * @throws Logs an error if a file does not export a class.
   */
  private async processFile<T extends ValidModule>(
    folder: string,
    file: string,
    handler: IAbstractHandlerLogic,
  ): Promise<void> {
    const importedModule = await lastValueFrom(this.importer.import<T>(folder, file));
    const { default: Module } = importedModule;

    if (!isClass(Module)) {
      console.error(`File ${file} is not Class!`);
      return;
    }

    const instance = new Module();
    handler.setLogic(instance);
  }
}
