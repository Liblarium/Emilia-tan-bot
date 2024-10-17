import { constants, access, appendFile, mkdir, unlink } from "node:fs/promises";
import { resolve } from "node:path";
import { inspect } from "node:util";
import type { BaseLogOptions, IBaseLog, LineType, TypeInline, TypeLog, TypeLogEnum, TypeText } from "@type/base/log";
import { EmiliaTypeError, date, dateAndTime, error, time } from "@util/s";

const BaseLogPath = "logs";

/**
 * Check if the input number is within the range of TypeLogEnum values (1 to 5)
 */
const checkType = (num: number): num is TypeLogEnum => {
  return num >= 1 && num <= 5;
};

/**
 * Class for working with logs
 */
export class BaseLog implements IBaseLog {
  /**
   * Text of log
   */
  text: TypeText;
  /**
   * If true, log will be written to console
   * @default true
   */
  logs: boolean;
  /**
   * Type of log
   * @default "info"
   */
  type: TypeLog;
  /**
   * If true, log will be written with event format
   * @default false
   */
  event: boolean;
  /**
   * If not 0, log will be written with new line
   * @default 0
   */
  inline: TypeInline;
  /**
   * Category of log
   * @default "other"
   */
  category: string;

  /**
   * Constructor for BaseLog
   * @param {BaseLogOptions} options
   */
  constructor({ text, type, event, logs, inline }: BaseLogOptions) {
    this.text = text ?? "{Ничего не указано}";
    this.logs = logs ?? true;
    this.type = type || "info";
    this.inline = inline || 0;
    this.event = event ?? false;
    this.category = "other";

    if (typeof type === "number") this.setType(type);
  }

  /**
   * Method for change number value of type to string
   * @param {TypeLog | undefined} type
   */
  setType(type: TypeLog | undefined): void {
    if (type == null) { error("BaseLog.setType: type is null or undefined!"); return; }
    if (typeof type !== "number") { error(`BaseLog.setType: ${type ?? "[error]"} не является числом!`); return; }
    if (!checkType(type)) throw new EmiliaTypeError(`BaseLog.setType: ${(type as number).toString()} не входит в число доступных типов! [Допустимы: 1 - info, 2 - error, 3 - warning, 4 - debug, 5 - test]`);

    const typeLogMap: Record<number, TypeLog> = {
      1: "info",
      2: "error",
      3: "warning",
      4: "debug",
      5: "test",
    };
    this.type = typeLogMap[type];
  }

  /**
   * Method for enable/disable log writing to console
   * @param {boolean} logs
   */
  setLogs(logs: boolean): void {
    if (typeof logs === "boolean") this.logs = logs;
  }

  /**
   * Method for enable/disable event log format
   * @param {boolean} event
   */
  setEvent(event: boolean): void {
    if (typeof event === "boolean") this.event = event;
  }

  /**
   * Method for change inline mode
   * @param {TypeInline} inline
   */
  setInline(inline: TypeInline): void {
    if (typeof inline === "number") this.inline = inline;
  }

  /**
   * Method for change category of log
   * @param {string} category
   */
  setCategory(category: string): void {
    if (category) this.category = category;
  }

  /**
   * Method for check if log file exists
   * @param {string} names
   * @returns {Promise<boolean>}
   */
  async checkLog(names: string): Promise<boolean> {
    if (typeof this.category !== "string") this.category = "other";

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
   * Method for create log folder
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
      error("BaseLog.createFolder: Не удалось создать папку!");
      error(e);
      return null;
    }
  }

  /**
   * Method for check if log folder exists. If not, create folder
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
        error("BaseLog.checkFolder:", e);
        return null;
      }
    }
  }

  /**
   * Method for add log to file
   * @param {TypeText} text
   * @param {TypeLog} logType
   * @returns {Promise<true | null>}
   */
  async addLog(text: TypeText, logType: TypeLog): Promise<true | null> {
    const types = logType || this.type;
    // prettier-ignore
    const type = typeof types === "string" ? types.toLowerCase() : (() => {
      this.setType(types);
      const tp = this.type;

      if (typeof tp === "number") return tp.toString();
      return tp.toLowerCase();

    })();
    const category = this.category.toLowerCase();

    try {
      const logPath = resolve(BaseLogPath, category, `${category}-${date()}.log`);
      const textOut = typeof text === "object" ? inspect(text) : typeof text === "string" ? text : `${text}`;
      const logText = `${dateAndTime()}[${category.toUpperCase()} | ${type}]: ${textOut}\n`;
      await appendFile(logPath, logText);
      return true;
    } catch (e) {
      error(e);
      return null;
    }
  }

  /**
   * Method for delete log file
   * @param {string} fileName
   * @returns {Promise<boolean | null>}
   */
  async deleteFile(fileName: string): Promise<boolean | null> {
    try {
      if (!fileName.endsWith(".txt") || !fileName.endsWith(".log")) {
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
      }

      return false;
    } catch (e) {
      error(e);
      return null;
    }
  }

  /**
   * Method for write log to console and file
   * @returns {Promise<void>}
   */
  async log(): Promise<void> {
    const text = this.text;
    const type: TypeLog = (typeof this.type === "string" ? this.type.toLowerCase() : (this.setType(this.type), this.type)) as TypeLog;
    const category = this.category.toLowerCase();
    const checkFolder = await this.checkFolder(category);
    const logs = this.logs;

    const inline = this.inline;
    let line: { news: LineType; last: LineType } = {
      news: "",
      last: "",
    };
    const inlineMap: Record<number, { news: LineType; last: LineType }> = {
      0: line,
      1: {
        news: "\n",
        last: line.last,
      },
      2: {
        news: line.news,
        last: "\n",
      },
      3: {
        news: "\n",
        last: "\n",
      },
    };

    if (inline >= 0 || inline <= 3) line = inlineMap[inline];
    if (checkFolder == null) { error("BaseLog.log: Не удалось создать папку!"); return; }

    try {
      await this.addLog(text, type);

      const logText = {
        in: typeof text === "object" ? "" : typeof text === "string" ? text : `${text}`,
        out: typeof text === "object" ? text : "",
      };
      let splits: string[] = [];
      let editText: string = logText.in;

      if (this.event && logText.in.length > 0 && type !== "error") splits = logText.in.split(":");
      if (this.event && splits.length > 0) editText = logText.in.slice(splits[0].length + 2);

      if (logs) console.log(`${line.news}[${time()}][${category} | ${typeof type === "string" ? type : type.toString()}]: ${editText}`, logText.out, line.last);

    } catch (e: unknown) {
      error("BaseLog.log:", e);
      await this.addLog((e as Error).message, "error");
    }
  }
}
