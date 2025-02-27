import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { Abstract, Config, Enums } from "@constants";
import type { ArrayNotEmpty } from "@type";
import type {
  AbstractLogOptionsExtended,
  AddLogOptions,
  IAbstractLog,
  IAbstractLogWithDependencies,
  LogEntry,
  TypeLog,
  TypeText,
} from "@type/constants/log";
import type { ClassWithValidator, Result } from "@type/utils";
import type { IFileManager } from "@type/utils/fileManager";
import type { IFileValidator } from "@type/utils/fileValidator";
import type { IJSONReader } from "@type/utils/jsonReader";
import type { IJSONWriter } from "@type/utils/jsonWriter";
import type { ILogFormatters } from "@type/utils/logFormatter";
import { Decorators, Formatters, emiliaError } from "@utils";

const baseLogPath = process.env.BASE_LOG_PATH ?? "logs";
const error: (...e: unknown[]) => void = (...e: unknown[]) =>
  console.error([Formatters.time()], e);
/**
 * Class for working with logs
 */
export abstract class AbstractLog implements IAbstractLog {
  /**
   * Text of log
   */
  protected text: TypeText;
  /**
   * If true, log will be written to console
   * @default true
   */
  protected logs: boolean;
  /**
   * Type of log
   * @default LogType.Info = "info"
   */
  protected type: TypeLog;
  /**
   * If true, log will be written with event format
   * @default false
   */
  protected event: boolean;
  /**
   * If not 0, log will be written with new line
   * @default InlineType.None = 0
   */
  protected inline: Enums.InlineType;
  /**
   * Category of log
   * @default "other"
   */
  protected categories: ArrayNotEmpty<string>;
  /**
   * Metadata of log
   * @default undefined
   */
  protected metadata?: object;
  /**
   * Context of log
   * @default {}
   */
  protected context?: object = {};
  /**
   * Timestamp of log. Used on metadata for logs. Default is current timestamp toISOString format
   */
  protected timestamp = new Date().toISOString();
  /**
   * Tags of log. Used on metadata for logs. Default is empty array)
   */
  protected tags: string[];
  /**
   * Code of log.
   * @default Enums.ErrorCode.UNKNOWN_ERROR
   */
  protected code: Enums.ErrorCode = Enums.ErrorCode.UNKNOWN_ERROR;

  /**
   * Instance of file manager
   */
  public readonly fileManager: IFileManager;
  /**
   * Instance of file manager. Static version. Becomes readonly after appointment
   */
  public static fileManager: IFileManager;
  /**
   * Instance of file validator
   */
  public readonly fileValidator: IFileValidator;
  /**
   * Instance of file validator. Static version. Becomes readonly after appointment
   */
  public static fileValidator: IFileValidator;
  /**
   * Instance of json reader. Static version. Becomes readonly after appointment
   */
  public static jsonReader: IJSONReader;
  /**
   * Instance of json writer. Static version. Becomes readonly after appointment
   */
  public static jsonWriter: IJSONWriter;
  /**
   * Instance of json reader
   */
  public readonly jsonReader: IJSONReader;
  /**
   * Instance of json writer
   */
  public readonly jsonWriter: IJSONWriter;
  /**
   * Instance of log formatter
   */
  public readonly logFormatter: ILogFormatters;
  /**
   * Instance of log formatter. Static version. Becomes readonly after appointment
   */
  public static logFormatter: ILogFormatters;

  /**
   * Constructs an instance of the AbstractLog class.
   *
   * @param {BaseLogOptions} options - The options for configuring the log.
   * @param {string} [options.text="{Nothing specified}"] - The text of the log entry.
   * @param {LogType} [options.type=LogType.Info] - The type of the log entry.
   * @param {boolean} [options.event=false] - Indicates if the log entry is an event.
   * @param {boolean} [options.logs=true] - Indicates if logging is enabled.
   * @param {number} [options.inline=0] - The inline level of the log entry.
   * @param {object} [options.metadata=undefined] - The metadata object for the log entry.
   * @param {object} [options.context={}] - The context object for the log entry (optional if no context is provided).
   * @param {string[]} [options.tags=[]] - The tags associated with the log entry (optional if no tags are provided).
   * @param {ArrayNotEmpty<string>} [options.categories=["global"]] - The categories associated with the log entry.
   * @param {ErrorCode} [options.code=ErrorCode.UNKNOWN_ERROR] - The code associated with the log entry.
   * @param {IFileManager} options.fileManager - The file manager instance (optional if no file manager is provided).
   * @param {IFileValidator} options.fileValidator - The file validator instance (optional if no file validator is provided).
   * @param {IJSONReader} options.jsonReader - The JSON reader instance.
   * @param {IJSONWriter} options.jsonWriter - The JSON writer instance.
   * @param {ILogFormatters} options.logFormatter - The log formatter instance .
   * @param {ICustomArray} options.customArray - The custom array instance.
   */
  constructor({
    text = "{Nothing specified}",
    type = Enums.LogType.Info,
    event = false,
    logs = true,
    inline = 0,
    code = Enums.ErrorCode.UNKNOWN_ERROR,
    metadata,
    context = {},
    tags = [],
    categories,
    fileManager,
    fileValidator,
    jsonReader,
    jsonWriter,
    logFormatter
  }: AbstractLogOptionsExtended) {
    this.text = text;
    this.logs = logs;
    this.type = type;
    this.inline = inline;
    this.event = event;
    this.categories = categories;
    this.metadata = metadata;
    this.context = context;
    this.tags = tags;
    this.code = code;

    // Dependencies injection
    this.fileManager = fileManager;
    this.fileValidator = fileValidator;
    this.jsonReader = jsonReader;
    this.jsonWriter = jsonWriter;
    this.logFormatter = logFormatter;
  }

  /**
   * Initialize the log by checking and creating the base log folder if necessary.
   * @returns {Promise<void>}
   */
  @Decorators.validateFileOperation<IAbstractLogWithDependencies>()
  public static async initialize(): Promise<void> {
    try {
      // Check if base log folder exists
      const folderCheckResult =
        await this.fileValidator.checkFolder(baseLogPath);

      // If it doesn't exist, create it
      if (!folderCheckResult.exists) {
        const splitedPath = baseLogPath.split("/");
        const path = splitedPath.slice(0, splitedPath.length - 1).join("/");
        const folder = await this.fileManager.createFolder(
          path,
          splitedPath[splitedPath.length - 1],
        );

        if (!folder.success)
          throw emiliaError(
            folder.error.message,
            folder.error.code,
            "InternalError",
          );
      }
    } catch (e) {
      error(
        `AbstractLog.initialize: ${e instanceof Abstract.AbstractEmiliaError ? e.message : "Unknown error"}`,
      );
    }
  }

  /**
   *This method is used to set the dependencies of the AbstractLog class.
   *
   * And this dep's readonly.
   *
   * @param {IFileManager} manager - The file manager.
   * @param {IFileValidator} validator - The file validator.
   * @param {IJSONReader} reader - The json reader.
   * @param {IJSONWriter} writer - The json writer.
   * @param {ILogFormatters} formatter - The formatter on log class.
   */
  public static setFileDependencies(
    manager: IFileManager,
    validator: IFileValidator,
    reader: IJSONReader,
    writer: IJSONWriter,
    formatter: ILogFormatters
  ): void {
    const dependencies = {
      fileManager: manager,
      fileValidator: validator,
      jsonReader: reader,
      jsonWriter: writer,
      logFormatter: formatter
    };

    Object.entries(dependencies).forEach(([key, value]) => {
      Object.defineProperty(this, key, {
        value,
        writable: false,
        configurable: false,
      });
    });
  }

  /**
   * Method for change categories of log
   * @param categoies - Categories of log
   */
  protected setCategories(categories: ArrayNotEmpty<string>): void {
    if (categories.length > 0) {
      this.categories = categories
        .map((cat) => cat.toLocaleLowerCase())
        .filter((cat) => /^[a-z0-9_-]+$/.test(cat)) as ArrayNotEmpty<string>;

      if (this.categories.length === 0) this.categories = ["global"];
    }
  }

  /**
   * Method for adding a log to a file.
   *
   * @param text - The text of the log.
   * @param logType - The type of the log.
   *
   * @returns A promise that resolves with an object containing the success status and an optional error message.
   *
   * @example 
   * ```ts
   * import { Enums, Abstract } from '@constants';
import { FileManager } from '../../utils/managers/FileManager';
   * 
   * class Log extends Abstract.AbstractLog {
   *   // your code here
   * }
   * 
   * const log = new Log({ text: "Hello from AbstractLog", type: LogType.Info });
   * const result = await log.addLog({ text: "Log message", logType: LogType.Warning, metadata: { key: "value" }, context: { key: "value" }, tags: ["tag1", "tag2"], errorCode: Enums.ErrorCode.UNKNOWN_ERROR });
   * console.log(result); // { success: true, data: undefined } or { success: false, error: { code: "APPEND_FILE_ERROR", message: "Failed to write log to file" } }
   * ```
   */
  protected async addLog({
    text,
    logType,
    metadata = {},
    context = {},
    tags = [],
    errorCode,
  }: AddLogOptions): Promise<Result<void>> {
    const editType = this.logFormatter.formatterType(logType ?? this.type);

    if (!editType.success) return editType;

    const type = editType.data.toLocaleString().toLocaleLowerCase();
    const categories = this.categories.map((cat) => cat.toLocaleLowerCase());

    const logFilePath = this.getCurrentLogPath();
    const fullText = this.logFormatter.formatterLog({
      text,
      type,
      categories,
      tags,
      metadata,
      context,
      errorCode,
    });

    // If the log file doesn't exist, create it
    if (!fullText.success) return fullText;
    if (logFilePath.trim() === "")
      return { success: false, error: { message: "Log file path is empty!", code: Enums.ErrorCode.INVALID_PATH } };

    try {
      return await this.fileManager.appendFile(
        logFilePath,
        fullText.data,
      );
    } catch (e) {
      const err = e instanceof Abstract.AbstractEmiliaError ? e : { message: "Failed to write log to file", code: Enums.ErrorCode.APPEND_FILE_ERROR };

      error(
        `AbstractLog.addLog: ${err.message}`,
      );

      return {
        success: false,
        error: {
          code: err.code,
          message: err.message,
        },
      };
    }
  }

  /**
   * Iterates over log files and log entries within each file.
   * For each log entry, it checks if it matches the given tags.
   * If filter is true, the log entry is included if it matches any of the tags.
   * If filter is false, the log entry is included if it matches all of the tags.
   * @param logFiles - The log files to iterate over.
   * @param tags - The tags to filter by.
   * @param filter - Whether to filter or not. Default is false.
   * @returns {Promise<Result<LogEntry>[]>} - A promise that resolves with an array of log entries matching the tags.
   */
  private async filterLogsByTags(logFiles: string[], tags: string[], filter = false): Promise<Result<LogEntry>[]> {
    const logEntries = [];

    for (const file of logFiles) {
      const logs = await this.readLogFile(file);

      for (const log of logs) {
        const callback = (val: string) => log.success && log.data.tags.includes(val);

        if (filter ? tags.some(callback) : tags.every(callback)) {
          logEntries.push(log);
        }
      }
    }

    return logEntries;
  }

  /**
   * Searches logs by tags, requiring all tags to match if matchAll is true.
   * @param tags - Array of tags to search for (e.g., ["error", "db"]).
   * @param matchAll - If true, all tags must match; if false, at least one tag must match. Default is false.
   * @param month - If true, search only in the current month's logs. Default is false.
   * @returns A promise resolving to an array of log entries matching the tags.
   * @example
   * ```ts
   * const logs = await log.findLogsByTags(["error", "db"], true);
   * console.log(logs); // [{ success: true, data: { text: "DB error", tags: ["error", "db"], ... } }]
   * ```
   */
  public async findLogsByTags(tags: string[], matchAll: boolean = false, month?: boolean): Promise<Result<LogEntry>[]> {
    const logFiles = await this.getLogFiles(month);

    return await this.filterLogsByTags(logFiles, tags, !matchAll);
  }

  /**
   * Helper method to get all log files.
   * @param {string} [month] - The month to filter by (optional).
   * @returns {Promise<string[]>} - A promise that resolves with an array of log file paths.
   */
  @Decorators.validateFileOperation<ClassWithValidator>()
  private async getLogFiles(month?: boolean): Promise<string[]> {
    const logDir = resolve(baseLogPath, month ? this.getCurrentLogFolder() : "");
    const files = await readdir(logDir);

    return files
      .filter((file) => file.endsWith(".log"))
      .map((file) => resolve(logDir, file));
  }

  /**
   * Helper method to read a log file and parse its entries.
   * @param filePath - The path to the log file.
   * @returns {Promise<Result<LogEntry>[]>} - A promise that resolves with an array of log entries.
   */
  private async readLogFile(filePath: string): Promise<Result<LogEntry>[]> {
    const results = await this.jsonReader.readLines<LogEntry>(filePath, Config.DELIMITER_LOG_FILE);

    results.forEach((res, index) => {
      if (!res.success) console.error(`Error in log entry ${index + 1}: ${res.error.message}, error code: ${res.error.code}`);
    });

    return results;
  }

  /**
   * This method is responsible for logging messages to a file and optionally to the console.
   * It first checks if the log category folder exists, and if not, it creates it.
   * Then, it calls the `addLog` method to write the log message to a file.
   * If the `logs` flag is set to true, it also logs the message to the console using the `LogFormatter.formattingConsole` method.
   * If an error occurs during the logging process, it catches the error, logs it to the console, and writes it to the file as an error log.
   *
   * @returns {Promise<void>} - A promise that resolves when the logging process is complete.
   */
  protected async log(): Promise<void> {
    const text = this.text;
    const type: TypeLog = this.type;
    const categories = this.categories.map((cat) => cat.toLowerCase());
    const logs = this.logs;
    const line = this.logFormatter.formattingLineType(this.inline);
    const currentPath = this.getCurrentLogFolder();

    const checkFolder = await this.fileValidator.checkFolder(currentPath);

    try {
      if (checkFolder.error) throw emiliaError(checkFolder.error.message, checkFolder.error.code, "InternalError");

      const errorCode = this.code;

      await this.addLog({ text, logType: this.type, errorCode });

      if (logs) {
        this.logFormatter.formattingConsole({
          message: text,
          type,
          errorCode,
          categories,
          event: this.event,
          logs,
          line,
        });
      }
    } catch (e) {
      error("BaseLog.log:", e);
      await this.addLog({
        text: e,
        logType: Enums.LogType.Error,
        errorCode: e.code,
      });
    }
  }

  /**
   * Extracts successful log entries from a list of results.
   * @param results - An array of Result objects containing log entries.
   * @returns An array of LogEntry objects that succeeded.
   */
  protected getSuccessfulLogs(results: Result<LogEntry>[]): LogEntry[] {
    return results.filter(r => r.success).map(r => r.data);
  }

  /**
   * Helper method to get the current log folder path based on the current date.
   * The path is in the format of `${baseLogPath}/${month}.${year}`.
   * @returns {string} The current log folder path.
   */

  protected getCurrentLogFolder(): string {
    const now = new Date();
    const monthYear = `${(now.getMonth() + 1).toString().padStart(2, "0")}.${now.getFullYear()}`;

    return `${baseLogPath}/${monthYear}`;
  }

  /**
   * Helper method to get the current log file path based on the current date.
   * The path is in the format of `${baseLogPath}/${month}.${year}/${day}.log`.
   * @returns {string} The current log file path.
   * @private
   */
  private getCurrentLogPath(): string {
    const now = new Date();
    const monthYear = this.getCurrentLogFolder();
    const сurrentDay = `${now.getDate()}`.padStart(2, "0");

    return `${baseLogPath}/${monthYear}/${сurrentDay}.log`;
  }
}
