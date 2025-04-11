import type { IAbstractHandlerLogic } from "@type/constants/handler";
import type { ValidModule } from "@type/handler/BaseModule";
import type { IHandlerCore } from "@type/handler/HandlerCore";
import { isClass } from "@utils/checkers/isClass";
import type { FolderScanner } from "./FolderScanner";
import type { ModuleImporter } from "./ModuleImporter";

export class HandlerCore
  implements IHandlerCore {
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
      const folders = await this.scanner.scan();

      for (const folder of folders) {
        const files = await this.scanner.scan(folder);

        for (const file of files) {
          const { default: Module } = await this.importer.import<T>(
            folder,
            file,
          );

          if (!isClass(Module)) {
            console.error(`File ${file} is not Class!`);
            continue;
          }

          const instance = new Module();
          await handler.setLogic(instance);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}
