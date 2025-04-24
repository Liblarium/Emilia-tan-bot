import type { ValidModule } from "./BaseModule.d.ts";
import type { Observable } from "rxjs";

/** Represents an imported module with a constructor */
export type HandlerModule<T extends ValidModule> = {
  /** The module’s default export as a constructor */
  default: new () => T;
};

export interface IModuleImporter {
  /** 
   * Imports a module from the specified folder and file 
   * 
   * @param folder - The folder to import the module from
   * @param file - The file to import the module from
   * @param forceReload - Whether to force reload the module even if it is already cached
   * */
  import<T extends ValidModule>(
    folder: string,
    file: string,
    forceReload?: boolean,
  ): Observable<HandlerModule<T>>;

  /** Clears the module cache */
  clearCache?(): void;
}