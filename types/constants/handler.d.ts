import type { ArrayNotEmpty, LimitedArray } from "@type";
import type { ValidModule } from "@type/handler/BaseModule";


export type HandlerPath = LimitedArray<ArrayNotEmpty<string>, 2>;

/**
 * Represents an abstract handler.
 * 
 * @template TModule - The type of the module to set as the logic for the handler.
 */
export interface IAbstractHandler extends IHandlerLogic {
  /**
   * Sets the filter to use when scanning the folder path. If the filter is not a valid
   * regular expression, the method does nothing.
   * 
   * @param filter - The filter to use when scanning the folder path.
   * @example
   * ```ts
   * handler.setFilter(/\.js$/);
   * ```
   */
  setFilter(filter: RegExp): void;

  /**
   * Sets the folder path for the handler to scan. If the path is invalid, the method does nothing.
   * 
   * @param path - The folder path to scan. The path should be an array of two strings, 
   *   where the first string is the folder and the second string is the sub-folder.
   *
   * @example
   * ```ts
   * const path = ["dist", "command"];
   * handler.setFolderPath(path);
   * ```
   */
  setFolderPath(path: HandlerPath): void;
}

export interface IAbstractHandlerLogic {
  /**
   * Sets the logic for the handler.
   * @param module - The module to set as the logic for the handler.
   * @returns A promise that resolves when the logic is set.
   * @example
   * ```ts
   * class SomeHandler extends AbstractHandler {
   *   // ...
   *
   *   async setLogic(module: ValidModule): Promise<void> {
   *   // your logic
   *   }
   * }
   * ```
   */
  setLogic(module: ValidModule): void | Promise<void>;
}

export interface IAbstractHandlerInjection {
  folderPath: HandlerPath;
  filterFile: RegExp;
}

/**
 * Type for guild prefix in database
 */
export type GuildPrefix = { now: string, default: string }