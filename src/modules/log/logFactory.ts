import { Log } from "@log";
import { FileLogger } from "@log/FileLogger";
import type { FileLoggerOptions, LogOptions, PinoLoggerOptions } from "@type";
import { PinoLogger } from "./PinoLogger";

export class LogFactory {
  private static instance: Log;

  private static get getInstance(): Log {
    if (!this.instance) this.instance = new Log();

    return this.instance;
  }

  public static async log(logOptions: Omit<LogOptions, "consoleLogger" | "fileLogger">, optionalOption?: { pinoOption?: PinoLoggerOptions, fileOption?: FileLoggerOptions }): Promise<void> {
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