import type { LogType } from "@enum/log";
import type { LoggerData, Logger as LoggerType } from "@type";

/**
 * Logger class
 */
export abstract class AbstractLogger implements LoggerType {
  abstract log(message: LoggerData, typeLog: LogType): Promise<void>;
  abstract info(message: LoggerData): Promise<void>;
  abstract error(message: LoggerData): Promise<void>;
  abstract debug(message: LoggerData): Promise<void>;
  abstract warning(message: LoggerData): Promise<void>;
}
