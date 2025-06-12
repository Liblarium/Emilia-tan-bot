import type { Observable } from "rxjs";

export interface FileLoggerOptions {
  /**
   * Rotate interval for log file
   */
  rotateInterval?: string;
  /**
   * Rotate size for log file
   */
  rotateSize?: string;
  /**
   * Pretty console output
   */
  pretty?: boolean;
}
