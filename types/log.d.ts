import type { InlineType } from "@constants/enum/log";
import type { ArrayNotEmpty } from "@type";
import type { TypeLog, TypeText } from "./constants/log";

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
 *   inline: InlineType.Before,
 * };
 * 
 * new Log(options); // [time]: Hello from LogOptions
 */
export interface LogOptions {
  /**
   * Log contents
   */
  text: TypeText;
  /**
   * information type. Numeric: 1 - info, 2 - error, 3- warning, 4 - debug, 5 - test
   * 
   * Or you can use LogType (enum)
   * 
   * @default LogType.Info = 1
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
   * @default InlineType.None = 0
   */
  inline?: InlineType;
}