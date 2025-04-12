import type { LogType } from "@constants/enum/log";
import type { LoggerData, Logger as LoggerType } from "@type/constants/logger";

/**
 * Logger class
 */
export abstract class AbstractLogger implements LoggerType {
  abstract log(message: LoggerData, typeLog: LogType): Promise<void>;
  abstract info(message: LoggerData): Promise<void>;
  abstract error(message: LoggerData): Promise<void>;
  abstract debug(message: LoggerData): Promise<void>;
}
