import type { PinoLoggerOptions } from "@type";
import { pino } from "pino";
import pinoRoll from "pino-roll";
import { AbstractPinoLogger } from "@abstract/AbstractPinoLogger";
import { date } from "@utils/formatters/timeAndDate";

/**
 * Implementation of Logger using Pino with console output
 */
export class PinoLogger extends AbstractPinoLogger {
  constructor(options: PinoLoggerOptions = {}) {
    const {
      timezone = "Europe/Kiev",
      logDir = "logs",
      rotateInterval = "1d",
      rotateSize = "10m",
      pretty = true,
      timestampFormat = "DD.MM.YYYY HH:mm:ss"
    } = options;

    // Create rolling file stream
    const fileStream = pinoRoll({
      file: `${logDir}/${date()}.log`,
      size: rotateSize,
      interval: rotateInterval,
      mkdir: true,
    });

    // Configure streams
    const streams: Parameters<typeof pino.multistream>[0] = [];

    // Add pretty console stream if enabled
    if (pretty) {
      const prettyStream = pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: { format: timestampFormat, timezone },
          ignore: "pid,hostname",
        }
      });
      streams.push({ stream: prettyStream });
    }

    // Add file stream
    streams.push({ stream: fileStream });

    // Create main logger instance
    const logger = pino(
      {
        timestamp: true,
        formatters: {
          level: (label) => ({ level: label }),
          bindings: () => ({})
        }
      },
      pino.multistream(streams)
    );

    super(logger);
  }
}