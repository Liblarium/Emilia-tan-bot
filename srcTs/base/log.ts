import { constants, access, appendFile, mkdir, unlink } from "node:fs/promises";
import { resolve } from "node:path";
import { inspect } from "node:util";
import type { BaseLogOptions, IBaseLog, LineType, TypeInline, TypeLog, TypeLogEnum, TypeText } from "@type/base/log";
import { EmiliaTypeError, date, dateAndTime, error, time } from "@util/s";

const BaseLogPath = "logs";

const checkType = (num: number): num is TypeLogEnum => {
  return num < 0 && num > 5;
};

export class BaseLog implements IBaseLog {
  text: TypeText;
  logs: boolean;
  type: TypeLog;
  event: boolean;
  inline: TypeInline;
  category: string;

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
   * Метод для изменения числового значения типа в строковый
   * @param type
   */
  setType(type: TypeLog | undefined): void {
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
   * Метод для влючения/выключения сообщения консоли при вводе данных.
   * @default true
   * @param logs
   */
  setLogs(logs: boolean): void {
    if (typeof logs === "boolean") this.logs = logs;
  }

  /**
   * Метод для влючения/выключения обрезки сообщения в консоль.
   * @default false
   * @param event
   */
  setEvent(event: boolean): void {
    if (typeof event === "boolean") this.event = event;
  }

  /**
   * Метод для консоли. Делает "разрыв" (\n) между строками. 0 - без изменений, 1 - сверху, 2 - снизу, 3 - оба варианта.
   * @default 0
   * @param inline
   */
  setInline(inline: TypeInline): void {
    if (typeof inline === "number") this.inline = inline;
  }

  /**
   * Метод для установки категории, куда будет отправлены логи
   * @default `other`
   * @param category
   */
  setCategory(category: string): void {
    if (category) this.category = category;
  }

  /**
   * Метод для проверка на наличие файла лога (.txt/.log)
   * @param names
   * @returns
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
   * Метод для создания папки-категории
   * @param path
   * @returns
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
   * Метод для проверки наличия папки-категории. В случае остуствия - создаёт папку. True - есть папка, False - была создана, null - произошла ошибка при создании папки
   * @param folder
   * @returns
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
   * Метод для добавления логов. Не основной метод. True - логи добавлены/обновлены, null - ошибка
   * @param text
   * @param logType
   * @returns
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
      const textOut = typeof text === "object" ? inspect(text) : typeof text === "string" ? text : text.toString();
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
   * @param fileName
   * @returns
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
        in: typeof text === "object" ? "" : typeof text === "string" ? text : text.toString(),
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
