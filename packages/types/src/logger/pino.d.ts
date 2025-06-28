import type { LogEntry } from "./log.d.ts";

export type LoggerData = Omit<LogEntry, "type">;

/**
 * Уровни логирования Pino
 */
export type PinoLogLevel = "info" | "error" | "warn" | "debug";

export interface PinoLoggerOptions {
  /**
   * The timezone for log timestamps
   * @default 'Europe/Kiev'
   */
  timezone?: string;

  /**
   * The directory for log files
   * @default 'logs'
   */
  logDir?: string;

  /**
   * The interval for log rotation
   * @default '1d'
   */
  rotateInterval?: string;

  /**
   * The size limit for log files before rotation
   * @default '10m'
   */
  rotateSize?: string;

  /**
   * Whether to use pretty printing for console output
   * @default true
   */
  pretty?: boolean;

  /**
   * The format for timestamps
   * @default 'DD.MM.YYYY HH:mm:ss'
   */
  timestampFormat?: string;
}

export interface PinoTransportTarget {
  target: string;
  options: Record<string, unknown>;
  level: PinoLogLevel;
}
