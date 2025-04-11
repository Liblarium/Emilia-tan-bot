import type { IAbstractHandlerLogic } from "@type/constants/handler";
import type { ValidModule } from "./BaseModule";

export interface IHandlerCore {
  /**
   * Builds the handler by scanning folders and files, importing modules, and setting up logic.
   * 
   * @param handler - The abstract handler to apply logic to.
   * @returns A promise that resolves when the build process is complete.
   * 
   * @throws Will log an error if any issues occur during scanning, importing, or setting logic.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  build<T extends ValidModule>(handler: IAbstractHandlerLogic): Promise<void>;
}