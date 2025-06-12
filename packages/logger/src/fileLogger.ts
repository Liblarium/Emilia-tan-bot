import { resolve } from "node:path";
import type { FileLoggerOptions } from "@emilia-tan/types";
import { Format } from "@emilia-tan/utils";
import { pino } from "pino";
import pinoRoll from "pino-roll";
import { AbstractPinoLogger } from "./pino/abstractPinoLogger";

/**
 * Implementation of Logger using Pino with file output
 */
export class FileLogger extends AbstractPinoLogger {
  constructor(
    private readonly logDir: string = "logs",
    options: FileLoggerOptions = {}
  ) {
    const { rotateInterval = "1d", rotateSize = "10m", pretty = false } = options;

    // Create rolling file stream
    const fileStream = pinoRoll({
      file: resolve(logDir, `${Format.date()}.log`),
      size: rotateSize,
      interval: rotateInterval,
      mkdir: true,
    });

    // Create file logger instance
    const logger = pino(
      {
        timestamp: true,
        formatters: {
          level: (label) => ({ level: label }),
          bindings: () => ({}),
        },
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
                  ignore: "pid,hostname",
                },
              }),
            },
          ])
        : fileStream
    );

    super(logger);
  }
}
