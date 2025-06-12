import type { LogFactoryOptionalOptions, LogFactoryOptions } from "@emilia-tan/types";
import { LogType } from "@emilia-tan/config";
import { Subject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { Log } from "./";
import { FileLogger, PinoLogger } from "./barrel";

export class LogFactory {
  private static instance: Log;
  private static logStream = new Subject<LogFactoryOptions>();

  private static get getInstance(): Log {
    if (!this.instance) {
      this.instance = new Log(); // initialize logger
    }
    return this.instance;
  }

  /**
   * Initialization of the reactive flow for the processing of logs
   */
  public static initializeReactiveLogging() {
    this.logStream
      .pipe(
        filter((log) => log.type !== LogType.Debug), // We filter the debugging logs
        map((log) => ({
          ...log,
          text: `[${new Date().toISOString()}] ${log.text}`, // Add a timestamp
        }))
      )
      .subscribe((log) => {
        console.log(log.text); // We bring the log into the console
        // Here you can add an entry to a file or sending to the server
      });
  }

  /**
   * Logging through the stream
   * @param logOptions - Options for logging
   * @param optionalOption - Additional options
   */
  public static log(
    logOptions: LogFactoryOptions,
    optionalOption?: Partial<LogFactoryOptionalOptions>
  ): void {
    // Directly process the log without using the stream
    const logger = this.getInstance;
    logger.logProcessing({
      ...logOptions,
      ...optionalOption,
      consoleLogger: new PinoLogger(optionalOption?.pinoOption),
      fileLogger: new FileLogger("logs", optionalOption?.fileOption),
    });

    // Optionally, you can still send it to the stream if needed
    this.logStream.next(logOptions);
  }
}
