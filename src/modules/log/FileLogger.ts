import { resolve } from "node:path";
import { pino } from "pino";
import pinoRoll from "pino-roll";
import { AbstractPinoLogger } from "@abstract/AbstractPinoLogger";
import type { FileLoggerOptions } from "@type";
import { date } from "@utils/formatters/timeAndDate";

/**
 * Implementation of Logger using Pino with file output
 */
export class FileLogger extends AbstractPinoLogger {
  constructor(
    private readonly logDir: string = "logs",
    options: FileLoggerOptions = {}
  ) {
    const {
      rotateInterval = "1d",
      rotateSize = "10m",
      pretty = false
    } = options;

    // Create rolling file stream
    const fileStream = pinoRoll({
      file: resolve(logDir, `${date()}.log`),
      size: rotateSize,
      interval: rotateInterval,
      mkdir: true
    });

    // Create file logger instance
    const logger = pino(
      {
        timestamp: true,
        formatters: {
          level: (label) => ({ level: label }),
          bindings: () => ({})
        }
      },
      pretty
        ? pino.multistream([
          { level: "trace", stream: fileStream },
          {
            level: "trace",
            stream: pino.transport({
              target: "pino-pretty",
              options: {
                destination: resolve(logDir, "pretty.log"),
                translateTime: "DD.MM.YYYY HH:mm:ss",
                ignore: "pid,hostname"
              }
            })
          }
        ])
        : fileStream
    );

    super(logger);
  }
}
