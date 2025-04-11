import type { ValidModule } from "./BaseModule";

/** Represents an imported module with a constructor */
export type HandlerModule<T extends ValidModule> = {
  /** The module’s default export as a constructor */
  default: new () => T;
};

export interface IModuleImporter {
  /** Imports a module from the specified folder and file */
  import<T extends ValidModule>(
    folder: string,
    file: string,
    forceReload?: boolean,
  ): Promise<HandlerModule<T>>;
  /** Clears the module cache */
  clearCache?(): void;
}