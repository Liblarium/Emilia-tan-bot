import { LogType } from "@constants/enum/log";
import type { LoggerData } from "@type/constants/logger";
import type { LogOptions } from "@type/log";
import type { Result } from "@type/utils";

/**
 * Class for logging data to a file and console
 *
 * "Label" notations in comments:
 * - `!:` - unimplemented mandatory argument
 * - `!|?:` - unimplemented optional argument
 * - `|?:` - optional argument
 * - if without `!` or `?` - then mandatory argument
 * @example
 * new Log().logProcessing({
 *   text: "Log contents".
 *   type: LogType.Info, //information type. Numeric: 1 - info, 2 - error, 3- warning, 4 - debug, 5 - test
 *   event: false, //|?: by default false. Whether to truncate output in console.log().
 *   categories: ["global", "database"], //In which categories to write all specified logs. Outputted once in console.log(). Not necessarily global or database, string[] there
 *   logs: true, //|?: whether to output text to console. By default, true
 *   inline: InlineType.Before, //|?: affects only the text in the console. 0 - No change, 1 - wrap from top to bottom, 2 - from bottom, 3 - both.
 *   code: ErrorCode.UNKNOWN_ERROR, //code to write to the log
 *   tags: ["tag1", "tag2"], //tags to add to the log
 *   metadata: { code: "value"}, //|?: metadata to add to the log
 *   context: { code: "value" }, //|?: context to add to the log
 * });
 *
 */
export class Log {
  /**
   * Constructs a new Log object
   * @param logOptions
   * @param logOptions.text Log contents
   * @param logOptions.type information type. Numeric: 1 - info, 2 - error, 3- warning, 4 - debug, 5 - test
   * @param logOptions.event |? by default false. Whether to truncate output to console.log()
   * @param logOptions.categories global | database. |? Categories to write all specified logs to. Output is made once in console.log(). If not specified, global will be used
   * @param logOptions.logs ?: whether to output text to console. By default true
   * @param logOptions.inline |?: affects only the text in the console. 0 - No change, 1 - wrap at the top, 2 - at the bottom, 3 - both.
   * @param logOptions.code code to write to the log
   * @param logOptions.tags tags to add to the log
   * @param logOptions.metadata |?: metadata to add to the log
   * @param logOptions.context |?: context to add to the log
   */
  public async logProcessing(
    logOptions: LogOptions,
  ): Promise<void | Result<LogType>> {
    const {
      type,
      logFormatter,
      consoleLogger,
      event = false,
      fileLogger,
      inline,
      logs = true,
    } = logOptions;
    let logType: LogType = typeof type === "number" ? LogType.Info : type;

    if (typeof type === "number") {
      const result = logFormatter.formatterType(type);

      if (result.success) logType = result.data;
      return result;
    }

    const logData: LoggerData = {
      text: logOptions.text,
      categories: logOptions.categories,
      tags: logOptions.tags,
      metadata: logOptions.metadata ?? {},
      context: logOptions.context ?? {},
      errorCode: logOptions.code,
      timestamp: new Date().toISOString(),
    };
    const consoleData = { ...logData, inline };

    // If the console logger is enabled and logs is true
    if (logs && consoleLogger) await consoleLogger[logType](consoleData, event);

    // If the file logger is enabled
    if (fileLogger) await fileLogger[logType](logData);
  }
}
