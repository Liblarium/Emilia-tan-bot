import { Abstract } from "@constants";
import type { LogOptions } from "@type/log";
import { Checkers, Formatters, JSONs, Managers } from "@utils";

const fileValidator = new Checkers.FileValidator();
const fileManager = new Managers.FileManager(fileValidator);
const jsonReader = new JSONs.JSONReader(fileValidator);
const jsonWriter = new JSONs.JSONWriter(fileValidator, fileManager);
const logFormatter = Formatters.LogFormatter;

/**
 * A function to catch any errors that may occur in the code
 * and log them to the console with a red color
 * @param e The error that occurred
 */
const catchs = (e: unknown) => {
  console.error("\x1b[31m", e, "\x1b[0m");
};

/**
* Class for logging data to a file and console
*
* "Label" notations in comments:
* - `!:` - unimplemented mandatory argument
* - `!|?:` - unimplemented optional argument
* - `|?:` - optional argument
* - if without `!` or `?` - then mandatory argument
* @example
* new Log({
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
export class Log extends Abstract.AbstractLog {
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
  constructor({
    text,
    type,
    event = false,
    categories,
    logs = true,
    inline = 0,
    code,
    tags = [],
    metadata,
    context = {},
  }: LogOptions) {
    super({ text, type, event, logs, inline, code, jsonReader, jsonWriter, fileValidator, logFormatter, fileManager, categories, tags, metadata, context });

    this.log().catch(catchs);
  }
}

