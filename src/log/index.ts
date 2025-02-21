import { Abstract, Enums } from "@constants";
import type { ArrayMaybeEmpty } from "@type";
import type { LogOptions } from "@type/log";
import { Checkers, Formatters } from "@utils";

const fileValidator = new Checkers.FileValidator();

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
* });
*
*/
export class Log extends Abstract.AbstractLog {
  /**
   * Other categories to write logs to, excluding the main one
   * @type {ArrayMaybeEmpty<string>}
   * @private
   */
  private readonly otherCategories: ArrayMaybeEmpty<string>;

  /**
   * Constructs a new Log object
   * @param {LogOptions} logOptions
   * @param {string} logOptions.text Log contents
   * @param {TypeLog} logOptions.type information type. Numeric: 1 - info, 2 - error, 3- warning, 4 - debug, 5 - test
   * @param {boolean} [logOptions.event=false] |? by default false. Whether to truncate output to console.log()
   * @param {ArrayMaybeEmpty<string>} logOptions.categories global | database. |? Categories to write all specified logs to. Output is made once in console.log()
   * @param {boolean} [logOptions.logs=true] ?: whether to output text to console. By default true
   * @param {TypeInline} [logOptions.inline=0] |?: affects only the text in the console. 0 - No change, 1 - wrap at the top, 2 - at the bottom, 3 - both.
   */
  constructor({
    text,
    type,
    event = false,
    categories,
    logs = true,
    inline = 0,
  }: LogOptions) {
    const uniqueCategories: ArrayMaybeEmpty<string> = Array.from(new Set(categories)).filter((category) => category !== "");

    super({ text, type, event, logs, inline });

    if (typeof type === "number") type = Formatters.LogFormatter.formatterType(type) ?? Enums.LogType.Error;
    if (!categories.length) categories = ["other"];

    this.setCategory(uniqueCategories[0]);
    this.otherCategories = uniqueCategories.slice(1);

    this.log().catch(catchs);
    this._addLogs().catch(catchs);
  }

  /**
   * Private method to add logs to all categories except the main one
   * @returns {Promise<void>}
   * @private
   */
  private async _addLogs(): Promise<void> {
    const categories = this.otherCategories;

    if (categories.length === 0) return;

    for (const categoryName of categories) {
      const folderCheckResult = await fileValidator.checkFolder(
        categoryName.toLowerCase(),
      );

      if (folderCheckResult.error) {
        const errorText = `Не удалось создать папку ${categoryName}!`;
        console.error(`[${Formatters.time()}][Log._addLogs | error]:`, errorText);
        this.setCategory("global");
        this.addLog(errorText, Enums.LogType.Error).catch(catchs);
        continue;
      }

      this.setCategory(categoryName);
      this.addLog(this.text, this.type).catch(catchs);
    }
  }
}

