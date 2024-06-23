import { BaseLogOptions, IBaseLog, LineType, TypeInline, TypeLog, TypeText } from "../../types/base/log";
import { access, appendFile, constants, mkdir, unlink } from "fs/promises";
import { date, dateAndTime, EmiliaTypeError, error, time } from "../utils";
import { resolve } from "path";
import { inspect } from "util";

const BaseLogPath = `logs`;

export class BaseLog implements IBaseLog {
  text: TypeText;
  logs: boolean;
  type: TypeLog;
  event: boolean;
  inline: TypeInline;
  category: string;

  constructor({ text, type, event, logs, inline }: BaseLogOptions) {
    this.text = text || `{Ничего не указано}`;
    this.logs = logs ?? true;
    this.type = type || `info`;
    this.inline = inline || 0;
    this.event = event ?? false;
    this.category = `other`;

    if (typeof type == `number`) this.setType(type);
  }

  /**
   * Метод для изменения числового значения типа в строковый
   * @param {TypeLog | undefined} type
   * @returns {void}
   */
  setType(type: TypeLog | undefined): void {
    if (typeof type !== `number`) return error(`BaseLog.setType: ${type} не является числом!`);
    if (type < 0 || type > 5) throw new EmiliaTypeError(`BaseLog.setType: ${type} не входит в число доступных типов! [Допустимы: 1 - info, 2 - error, 3 - warning, 4 - debug, 5 - test]`);

    const typeLogMap: { [key: number]: TypeLog } = {
      1: `info`,
      2: `error`,
      3: `warning`,
      4: `debug`,
      5: `test`,
    };
    this.type = typeLogMap[type];
  }

  /**
   * Метод для влючения/выключения сообщения консоли при вводе данных.
   * @default true
   * @param {boolean} logs
   */
  setLogs(logs: boolean): void {
    if (typeof logs == `boolean`) this.logs = logs;
  }

  /**
   * Метод для влючения/выключения обрезки сообщения в консоль.
   * @default false
   * @param {boolean} event
   */
  setEvent(event: boolean): void {
    if (typeof event == `boolean`) this.event = event;
  }

  /**
   * Метод для консоли. Делает "разрыв" (\n) между строками. 0 - без изменений, 1 - сверху, 2 - снизу, 3 - оба варианта.
   * @default 0
   * @param {TypeInline} inline
   */
  setInline(inline: TypeInline): void {
    if (typeof inline == `number`) this.inline = inline;
  }

  /**
   * Метод для установки категории, куда будет отправлены логи
   * @default `other`
   * @param {string} category
   */
  setCategory(category: string): void {
    if (category) this.category = category;
  }

  /**
   * Метод для проверка на наличие файла лога (.txt/.log)
   * @param {string} names
   * @returns {Promise<boolean>}
   */
  async checkLog(names: string): Promise<boolean> {
    if (typeof this.category != `string`) this.category = `other`;

    const category = this.category.toLowerCase();
    const name = names ? names.toLowerCase() : `${category}-${date()}.log`;

    try {
      await access(resolve(BaseLogPath, category, name), constants.F_OK | constants.R_OK | constants.W_OK);
      return true;
    } catch (e) {
      error(e);
      return false;
    }
  }

  /**
   * Метод для создания папки-категории
   * @param {string} path
   * @returns {Promise<true | null>}
   */
  async createFolder(path: string): Promise<true | null> {
    const pathFolder = resolve(BaseLogPath);
    const logFolder = resolve(pathFolder, path.toLowerCase());

    try {
      await access(pathFolder, constants.W_OK);
      await mkdir(logFolder, { recursive: true });
      return true;
    } catch (e) {
      error(`BaseLog.createFolder: Не удалось создать папку!`);
      error(e);
      return null;
    }
  }

  /**
   * Метод для проверки наличия папки-категории. В случае остуствия - создаёт папку. True - есть папка, False - была создана, null - произошла ошибка при создании папки
   * @param {string} folder
   * @returns {Promise<boolean | null>}
   */
  async checkFolder(folder: string): Promise<boolean | null> {
    const folderLog = resolve(BaseLogPath, folder.toLowerCase());

    try {
      await access(folderLog, constants.F_OK | constants.W_OK);
      return true;
    } catch (err) {
      try {
        await this.createFolder(folder);
        return false;
      } catch (e) {
        error(`BaseLog.checkFolder:`, e);
        return null;
      }
    }
  }

  /**
   * Метод для добавления логов. Не основной метод. True - логи добавлены/обновлены, null - ошибка
   * @param {TypeText} text
   * @param {TypeLog} logType
   * @returns {Promise<true | null>}
   */
  async addLog(text: TypeText, logType: TypeLog): Promise<true | null> {
    const types = logType || this.type;
    // prettier-ignore
    const type = typeof types == `string` ? types.toLowerCase() : (() => {
      this.setType(types);
      return `${this.type}`.toLowerCase();
    })();
    const category = this.category.toLowerCase();

    try {
      const logPath = resolve(BaseLogPath, category, `${category}-${date()}.log`);
      const textOut = typeof text == `object` ? inspect(text) : `${text}`;
      const logText = `${dateAndTime()}[${category.toUpperCase()} | ${type}]: ${textOut}\n`;
      await appendFile(logPath, logText);
      return true;
    } catch (e) {
      error(e);
      return null;
    }
  }

  /**
   * Метод для удаления файлов-логов. Не может удалять папки
   * @param {string} fileName
   * @returns {Promise<boolean | null>}
   */
  async deleteFile(fileName: string): Promise<boolean | null> {
    try {
      if (!fileName.endsWith(`.txt`) || !fileName.endsWith(`.log`)) {
        //нужно будет модифицировать так, что-бы за n границы не уходило
        error(`BaseLog.deleteFile: Вы не можете удалить файл, что не является ".txt" или ".log"!`);
        return null;
      }

      const filename = fileName.toLowerCase();
      const category = this.category.toLowerCase();
      const check = await this.checkLog(filename);

      if (check) {
        const filePath = resolve(BaseLogPath, category, filename);
        await unlink(filePath);
        return true;
      } else return false;
    } catch (e) {
      error(e);
      return null;
    }
  }
  async log(): Promise<void> {
    const text = this.text;
    const type: TypeLog = (typeof this.type == `string` ? this.type.toLowerCase() : (this.setType(this.type), `${this.type}`.toLowerCase())) as TypeLog;
    const category = this.category.toLowerCase();
    const checkFolder = await this.checkFolder(category);
    const logs = this.logs;

    const inline = this.inline;
    let line: { news: LineType; last: LineType } = {
      news: ``,
      last: ``,
    };
    const inlineMap: { [key: number]: { news: LineType; last: LineType } } = {
      0: line,
      1: {
        news: `\n`,
        last: line.last,
      },
      2: {
        news: line.news,
        last: `\n`,
      },
      3: {
        news: `\n`,
        last: `\n`,
      },
    };

    if (inline >= 0 || inline <= 3) line = inlineMap[inline];
    if (checkFolder == null) return error(`BaseLog.log: Не удалось создать папку!`);

    try {
      await this.addLog(text, type);
      const logText = {
        in: typeof text === `object` ? `` : `${text}`,
        out: typeof text === `object` ? text : ``,
      };
      let splits: string[] = [];
      let editText: string = logText.in;

      if (this.event && logText.in.length > 0 && type != `error`) splits = logText.in.split(`:`);
      if (this.event && splits.length > 0) editText = logText.in.slice(splits[0].length + 2);

      if (logs) console.log(`${line.news}[${time()}][${category} | ${type}]: ${editText}`, logText.out, line.last);
    } catch (e) {
      error(`BaseLog.log:`, e);
      await this.addLog(e, `error`);
    }
  }
}
