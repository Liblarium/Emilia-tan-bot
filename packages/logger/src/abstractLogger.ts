import type { LogType, LoggerData, LoggerType } from "@emilia-tan/types";
import type { Observable } from "rxjs";

/**
 * Logger class
 */
export abstract class AbstractLogger implements LoggerType {
  abstract log(
    message: LoggerData,
    typeLog: LogType
  ): Promise<void> | Observable<void>;
  abstract info(message: LoggerData): Promise<void> | Observable<void>;
  abstract error(message: LoggerData): Promise<void> | Observable<void>;
  abstract debug(message: LoggerData): Promise<void> | Observable<void>;
  abstract warning(message: LoggerData): Promise<void> | Observable<void>;
}
