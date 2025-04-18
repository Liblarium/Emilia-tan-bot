import { Log } from "@log";
import { FileLogger } from "@log/FileLogger";
import type { LogFactoryOptions, LogFactoryOptionalOptions } from "@type";
import { PinoLogger } from "./PinoLogger.js";

export class LogFactory {
  private static instance: Log;

  private static get getInstance(): Log {
    if (!this.instance) this.instance = new Log();

    return this.instance;
  }

  /**
   * Logs the given logOptions using the logger instance.
   * @param logOptions - Options for logging. See {@link LogFactoryOptions}.
   * @param optionalOption - Optional options. See {@link LogFactoryOptionalOptions}.
   */
  public static async log(logOptions: LogFactoryOptions, optionalOption?: Partial<LogFactoryOptionalOptions>): Promise<void> {
    const logger = this.getInstance;
    await logger.logProcessing({
      ...logOptions,
      consoleLogger: new PinoLogger(optionalOption?.pinoOption),
      fileLogger: new FileLogger(
        "logs",
        optionalOption?.fileOption
      ),
    });
  }
}