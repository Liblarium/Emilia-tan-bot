export interface ICommandHandler {
  /**
   * Initializes the command handler by building the logic for all commands.
   *
   * @returns A promise that resolves when the build process is complete.
   *
   * @throws Will log an error if any issues occur during scanning, importing, or setting logic.
   */
  handler(): Promise<void>;
}