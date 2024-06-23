import { PathArgsLimit } from "..";
import { BaseCommand } from "../../srcTs/base/command";
import { BaseEvent } from "../../srcTs/base/event";
import { EmiliaClient } from "../../srcTs/client";

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
