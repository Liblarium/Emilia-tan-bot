import type { BaseCommand } from "@base/command";
import type { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import type { PathArgsLimit } from "@type";

/**
 * Type for array with limited length and that cannot be empty.
 * @example
 * const arr: PathArgsLimit<string, 2> = ["a", "b"];
 * const arr2: PathArgsLimit<string, 3> = ["a", "b", "c"];
 */
export type ArrayPathLimit = PathArgsLimit<string, 2>;

/**
 * Type for module (BaseCommand, BaseEvent or null)
 */
export type ModuleType = BaseCommand | BaseEvent | null;

/**
 * Interface for base handler
 */
export interface IBaseHandler {
  /**
   * Client instance
   */
  client: EmiliaClient;

  /**
   * Path to folder with modules
   */
  folderPath: ArrayPathLimit;

  /**
   * Filter for files
   */
  filterFile: RegExp;

  /**
   * Method for changing filter
   * @param filter
   * @default /^[^.]+\.(js)$/
   */
  setFilter: (filter: RegExp) => void;

  /**
   * Method for changing path to folder with modules
   * @param path
   * @default ["srcJs", "commands"]
   */
  setFolderPath: (path: ArrayPathLimit) => void;

  /**
   * Method for changing logic of module
   * @param modules
   * @default null
   */
  setLogic: (modules: ModuleType) => void | null | Promise<void | null>;

  /**
   * Method for building modules
   */
  build: () => Promise<void>;
}


