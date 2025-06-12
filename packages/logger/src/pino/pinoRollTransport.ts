import { resolve } from "node:path";
import { Format } from "@emilia-tan/utils";
import type { TransportBaseOptions } from "pino";
import pinoRoll from "pino-roll";

/**
 * Creates a transport for pino that writes logs to a rolling file.
 * @param {TransportBaseOptions} [options={}] - Options for the transport.
 * @returns {NodeJS.WritableStream} - The rolling transport.
 */
export const createRollTransport = (options: TransportBaseOptions = {}): NodeJS.WritableStream => {
  return pinoRoll({
    file: resolve("logs", `${Format.date()}.log`),
    size: "10m",
    interval: "1d",
    mkdir: true,
    ...options,
  });
};
