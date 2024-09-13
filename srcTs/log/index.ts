import { BaseLog } from "@base/log";
import type { ArrayMaybeEmpty } from "@type";
import type { ILog, LogOptions } from "@type/log";
import { time } from "@util/s";

/**
 * A function to catch any errors that may occur in the code
 * and log them to the console with a red color
 * @param e The error that occurred
 */
const catchs = (e: unknown) => {
  console.error("\x1b[31m", e, "\x1b[0m");
};

/**
 * Класс для логирования данных в файл и консоль
 */
export class Log extends BaseLog implements ILog {
  private readonly otherCategories: ArrayMaybeEmpty<string>;

  /**
   * Обозначения "меток" в комментариях:
   * - `!:` - не реализованный обязательный аргумент
   * - `!|?:` - не реализованный необязательный аргумент
   * - `|?:` - не обязятельный аргумент
   * - если без `!` или `?` - значит обязательный аргумент
   * ```js
   * new Log({
   *  text: `Содержимое логов`.
   *  type: `info`, //тип информации. В числовом виде: 1 - info, 2 - error, 3- warning, 4 - debug, 5 - test
   *  event: false, //|?: по дерфолту false. Нужно ли обрезать вывод в console.log().
   *  categories: [`global`, `database`], //В какие категории записать все указанные логи. В console.log() выводится один раз. Не обязательно global или database, там string[]
   *  logs: true, //|?: нужно ли выводить текст в консоль. По дефолту true
   *  inline: 0, //|?: влияет только на текст в консоле. 0 - Без изменений, 1 - перенос сверху, 2 - снизу, 3 - оба.
   * });
   * ```
   * @param logOptions
   * @param logOptions.text Содержимое логов
   * @param logOptions.type тип информации. В числовом виде: 1 - info, 2 - error, 3- warning, 4 - debug, 5 - test
   * @param logOptions.event |?по дерфолту false. Нужно ли обрезать вывод в console.log()
   * @param logOptions.categories global | database. |? В какие категории записать все указанные логи. В console.log() выводится один раз
   * @param logOptions.logs ?: нужно ли выводить текст в консоль. По дефолту true
   * @param logOptions.inline |?: влияет только на текст в консоле. 0 - Без изменений, 1 - перенос сверху, 2 - снизу, 3 - оба.
   */
  constructor({
    text,
    type,
    event = false,
    categories,
    logs = true,
    inline = 0,
  }: LogOptions) {
    super({ text, type, event, logs, inline });
    this.text = text;
    this.type = type;
    this.logs = logs;
    this.inline = inline;

    if (typeof type === "number") this.setType(type);
    if (!categories.length) categories = ["other"];

    this.setCategory(categories[0]);
    this.otherCategories = categories.slice(1);

    this.log().catch(catchs);
    this._addLogs().catch(catchs);
  }

  /**
   * Метод для "раскидки" оставшихся логов по другим категориям
   */
  private async _addLogs(): Promise<void> {
    const categories = this.otherCategories;

    if (categories.length === 0) return;

    for (const categoryName of categories) {
      const folderCheckResult = await this.checkFolder(
        categoryName.toLowerCase(),
      );

      if (folderCheckResult == null) {
        const errorText = `Не удалось создать папку ${categoryName}!`;
        console.error(`[${time()}][Log._addLogs | error]:`, errorText);
        this.setCategory("global");
        this.addLog(errorText, "error").catch(catchs);
        continue;
      }

      this.setCategory(categoryName);
      this.addLog(this.text, this.type).catch(catchs);
    }
  }
}
