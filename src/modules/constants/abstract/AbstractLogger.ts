import type { LogType } from "@enum/log";
import type { LoggerData, Logger as LoggerType } from "@type";
import { Observable } from "rxjs";

/**
 * Logger class
 */
export abstract class AbstractLogger implements LoggerType {
  abstract log(message: LoggerData, typeLog: LogType): Promise<void> | Observable<void>;
  abstract info(message: LoggerData): Promise<void> | Observable<void>;
  abstract error(message: LoggerData): Promise<void> | Observable<void>;
  abstract debug(message: LoggerData): Promise<void> | Observable<void>;
  abstract warning(message: LoggerData): Promise<void> | Observable<void>;
}
