import { resolve } from "node:path";
import type { HandlerPath } from "@type/constants/handler";
import type { ValidModule } from "@type/handler/BaseModule";
import type { HandlerModule, IModuleImporter } from "@type/handler/ModuleImporter";
import { setType } from "@utils/other/setType";

export class ModuleImporter implements IModuleImporter {
  private moduleCache = new Map<string, HandlerModule<ValidModule>>();

  constructor(private folderPath: HandlerPath) { }

  /**
   * Imports a module from the specified folder and file
   *
   * @param folder - The folder to import the module from
   * @param file - The file to import the module from
   * @param forceReload - Whether to force reload the module even if it is already cached
   *
   * @returns A promise that resolves with an object with a default property that is the constructor of the imported module
   *
   * @throws An error if the module does not have a default export or does not implement the required interface
   */
  async import<T extends ValidModule>(
    folder: string,
    file: string,
    forceReload = false,
  ): Promise<HandlerModule<T>> {
    const modulePath = resolve(...this.folderPath, folder, file);

    if (!forceReload && this.moduleCache.has(modulePath)) {
      return setType<HandlerModule<T>>(this.moduleCache.get(modulePath));
    }

    const moduleDefault = await import(modulePath);
    if (!moduleDefault.default) {
      const error = new Error(`Module ${modulePath} does not have a default export`);
      console.error(error);
      throw error;
    }

    const moduleConstructor = moduleDefault.default;
    if (!this.isValidModuleConstructor(moduleConstructor)) {
      const error = new Error(`Module ${modulePath} does not implement required interface`);
      console.error(error);
      throw error;
    }

    const result = { default: moduleConstructor };
    this.moduleCache.set(modulePath, result);
    return setType<HandlerModule<T>>(result);
  }

  /**
   * Checks if the given value is a valid module constructor.
   *
   * @param module - The value to check
   *
   * @returns Whether the value is a valid module constructor
   */
  private isValidModuleConstructor(module: unknown): module is new () => ValidModule {
    return (
      typeof module === "function" &&
      "prototype" in module &&
      "name" in module.prototype &&
      "execute" in module.prototype &&
      typeof setType<ValidModule>(module.prototype).execute === "function"
    );
  }

  /**
   * Clears the module cache.
   *
   * This method removes all cached modules, forcing subsequent imports
   * to reload the modules from their respective files.
   */

  clearCache(): void {
    this.moduleCache.clear();
  }
}