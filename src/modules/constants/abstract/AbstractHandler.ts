import type { EmiliaClient } from "@client";
import { defaultHandlerFileFilter } from "@core/config";
import { FolderScanner } from "@handlers/FolderScanner";
import { HandlerCore } from "@handlers/HandlerCore";
import { ModuleImporter } from "@handlers/ModuleImporter";
import type {
  ArrayNotEmpty,
  HandlerPath,
  IAbstractHandler,
  IAbstractHandlerInjection,
  ValidModule
} from "@type";

export abstract class AbstractHandler implements IAbstractHandler {
  public readonly logCategories: ArrayNotEmpty<string> = ["handler"];

  /**
   * Constructs an instance of AbstractHandler.
   *
   * @param client - The Discord client instance.
   * @param injection - Configuration object for handler injection, including folder path and file filter.
   * @param injection.folderPath - The folder path to scan for commands.
   * @param injection.filterFile - The file filter to use when scanning the folder path.
   * @param scanner - The FolderScanner instance used for scanning directories; defaults to scanning the `injection.folderPath` with `injection.filterFile`.
   * @param core - The HandlerCore instance responsible for building the handler logic using the scanner and module importer.
   */
  constructor(
    public client: EmiliaClient,
    public injection: IAbstractHandlerInjection = {
      folderPath: ["dist", "command"],
      filterFile: defaultHandlerFileFilter,
    },
    private scanner: FolderScanner = new FolderScanner(
      injection.folderPath,
      injection.filterFile,
    ),
    private core = new HandlerCore(
      this.scanner,
      new ModuleImporter(injection.folderPath),
    ),
  ) { }

  abstract setLogic(module: ValidModule): void | Promise<void>;

  setFilter(filter: RegExp): void {
    if (filter instanceof RegExp) {
      this.scanner = new FolderScanner(this.injection.folderPath, filter);
    }
  }

  setFolderPath(path: HandlerPath): void {
    if (Array.isArray(path) && path.length === 2) {
      this.injection.folderPath = path;
      this.scanner = new FolderScanner(path, this.injection.filterFile);
    }
  }

  /**
   * Builds the handler by scanning folders and files, importing modules, and setting up logic.
   *
   * @returns A promise that resolves when the build process is complete.
   *
   * @throws Will log an error if any issues occur during scanning, importing, or setting logic.
   */
  protected async build(): Promise<void> {
    try {
      await this.core.build(this);
    } catch (error) {
      console.error("Build failed:", error);
      throw error;
    }
  }
}
