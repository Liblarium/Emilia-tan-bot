import type { BaseCommand } from "@base/command";
import type { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import type { PathArgsLimit } from "@type";

export type ArrayPathLimit = PathArgsLimit<string, 2>;
export type ModuleType = BaseCommand | BaseEvent | null;
export interface IBaseHandler {
  client: EmiliaClient;
  folderPath: ArrayPathLimit;
  filterFile: RegExp;

  setFilter: (filter: RegExp) => void;
  setFolderPath: (path: ArrayPathLimit) => void;
  setLogic: (modules: ModuleType) => void | null | Promise<void | null>;
  build: () => Promise<void>;
}
