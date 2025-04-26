import { resolve } from "node:path";
import pinoRoll from "pino-roll";
import type { TransportBaseOptions } from "pino";
import { date } from "@utils/formatters/timeAndDate";

/**
 * Creates a transport for pino that writes logs to a rolling file.
 * @param {TransportBaseOptions} [options={}] - Options for the transport.
 * @returns {TransportStream} - The rolling transport.
 */
export const createRollTransport = (options: TransportBaseOptions = {}) => {
  return pinoRoll({
    file: resolve("logs", `${date()}.log`),
    size: "10m",
    interval: "1d",
    mkdir: true,
    ...options
  });
}; 