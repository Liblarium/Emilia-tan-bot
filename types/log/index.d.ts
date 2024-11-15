import type { ArrayNotEmpty } from "@type";
import type { TypeInline, TypeLog, TypeText } from "@type/base/log";

/**
 * Options for Log class
 * @property {TypeText} text - Log contents
 * @property {TypeLog} type - information type. Numeric: 1 - info, 2 - error, 3- warning, 4 - debug, 5 - test
 * @property {ArrayNotEmpty<string>} categories - In which categories to write all specified logs. Outputted once in console.log(). Not necessarily global or database, string[] there
 * @property {boolean} [event=false] - Whether to truncate output in console.log().
 * @property {boolean} [logs=true] - Whether to output text to console. By default, true
 * @property {TypeInline} [inline=0] - Affects only the text in the console. 0 - No change, 1 - wrap from top to bottom, 2 - from bottom, 3 - both.
 * @example
 * const options: LogOptions = {
 *   text: "Hello from LogOptions",
 *   type: 1,
 *   categories: ["category1", "category2"],
 *   event: false,
 *   logs: true,
 *   inline: 1,
 * };
 */
export interface LogOptions {
  /**
   * Log contents
   */
  text: TypeText;
  /**
   * information type. Numeric: 1 - info, 2 - error, 3- warning, 4 - debug, 5 - test
   */
  type: TypeLog;
  /**
   * In which categories to write all specified logs. Outputted once in console.log(). Not necessarily global or database, string[] there
   */
  categories: ArrayNotEmpty<string>;
  /**
   * Whether to truncate output in console.log().
   * @default false
   */
  event?: boolean;
  /**
   * Whether to output text to console. Once. By default, true
   * @default true
   */
  logs?: boolean;
  /**
   * Affects only the text in the console. 0 - No change, 1 - wrap from top to bottom, 2 - from bottom, 3 - both.
   * @default 0
   */
  inline?: TypeInline;
}

/**
 * Type for array that cannot be empty.
 * @example
 * const arr: ArrayNotEmpty<number> = [1];
 * const arr2: ArrayNotEmpty<number> = [1, 2, 3];
 */
export type { TypeText, TypeLog, TypeInline };

/**
 * Interface for Log class
 * @property {TypeText} text - Log contents
 * @property {TypeLog} type - information type. Numeric: 1 - info, 2 - error, 3- warning, 4 - debug, 5 - test
 * @property {boolean} logs - Whether to output text to console. By default, true
 * @property {TypeInline} inline - Affects only the text in the console. 0 - No change, 1 - wrap from top to bottom, 2 - from bottom, 3 - both.
 */
export interface ILog {
  text: TypeText;
  type: TypeLog;
  logs: boolean;
  inline: TypeInline;
}


