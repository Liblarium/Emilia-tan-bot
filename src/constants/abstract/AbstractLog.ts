import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { Enums } from "@constants";
import type { ArrayNotEmpty } from "@type";
import type { AddLogOptions, BaseLogOptions, LogEntry, TypeLog, TypeText } from "@type/constants/log";
import type { ClassWithFileManager, ClassWithValidator, Result } from "@type/utils/file";
import type { IFileManager } from "@type/utils/fileManager";
import type { IFileValidator } from "@type/utils/fileValidator";
import { Checkers, Decorators, Formatters, Managers, emiliaError } from "@utils";
import { type InlineType, LogType } from "../enum";

const fileValidator = new Checkers.FileValidator();
const fileManager = new Managers.FileManager(fileValidator);
const { LogFormatter, date, time } = Formatters;
const baseLogPath = process.env.BASE_LOG_PATH ?? "logs";
const error: (...e: unknown[]) => void = (...e: unknown[]) => console.error([time()], e);
/**
 * Class for working with logs
 */
export abstract class AbstractLog {
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
  protected inline: InlineType;
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
   * Timestamp of log. Used on metadata for logs. Default is current timestamp
   */
  protected timestamp = new Date().toISOString();
  /**
   * Tags of log. Used on metadata for logs. Default is empty array)
   */
  protected tags: string[];

  /** 
   * Instance of file manager
   */
  protected readonly fileManager: IFileManager = fileManager;
  /** 
   * Instance of file manager. Static version
   */
  protected static fileManager: IFileManager;
  /**
   * Instance of file validator
   */
  protected readonly fileValidator: IFileValidator = fileValidator;
  /**
   * Instance of file validator. Static version
   */
  public static fileValidator: IFileValidator;

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
   */
  constructor({ text = "{Nothing specified}", type = LogType.Info, event = false, logs = true, inline = 0, metadata, context = {}, tags = [] }: BaseLogOptions & ClassWithValidator & ClassWithFileManager) {
    this.text = text;
    this.logs = logs;
    this.type = type;
    this.inline = inline;
    this.event = event;
    this.categories = ["global"];
    this.metadata = metadata;
    this.context = context;
    this.tags = tags;

    this.fileManager = fileManager;
    this.fileValidator = fileValidator;
  }

  /**
   * Initialize the log by checking and creating the base log folder if necessary.
   * @returns {Promise<void>}
   */
  @Decorators.validateFileOperation<ClassWithValidator>()
  static async initialize(): Promise<void> {
    try {
      // Check if base log folder exists
      const folderCheckResult = await this.fileValidator.checkFolder(baseLogPath);

      // If it doesn't exist, create it
      if (!folderCheckResult.exists) {
        const folder = await this.fileManager.createFolder(baseLogPath, '');

        if (!folder.success) throw emiliaError(folder.error.message, folder.error.code, "InternalError");
      }
    } catch (e) {
      error(`AbstractLog.initialize: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }

  public static setFileDependencies(manager: IFileManager, validator: IFileValidator): void {
    this.fileManager = manager;
    this.fileValidator = validator;
  }

  /**
   * Method for change categories of log
   * @param categoies - Categories of log
   */
  protected setCategories(categories: ArrayNotEmpty<string>): void {
    if (categories.length > 0) this.categories = categories.map(cat => cat.toLowerCase()) as ArrayNotEmpty<string>;
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
   * import { Enums, Abstract } from '@constants';
   * 
   * class Log extends Abstract.AbstractLog {
   *   // your code here
   * }
   * 
   * const log = new Log({ text: "Hello from AbstractLog", type: LogType.Info });
   * const result = await log.addLog("Log message", LogType.Warning);
   * console.log(result); // { success: true }
   */
  protected async addLog({ text, logType, metadata = {}, context = {}, tags = [], errorCode }: AddLogOptions): Promise<Result> {
    const editType = LogFormatter.formatterType(logType ?? this.type);

    if (!editType) return {
      success: false,
      error: {
        code: Enums.ErrorCode.INVALID_LOG_TYPE,
        message: "Invalid log type. Please use a valid log type from the LogType enum.",
      },
    };

    const type = editType.toString().toLowerCase();
    const categories = this.categories.map(cat => cat.toLowerCase());

    const logFilePath = this.getCurrentLogPath();
    const fullText = LogFormatter.formatterLog({ text, type, categories, tags, metadata, context, errorCode });

    try {
      return await this.fileManager.appendFile(logFilePath, fullText);
    } catch (e) {
      error(`AbstractLog.addLog: ${e instanceof Error ? e.message : 'Unknown error'}`);

      return { success: false, error: { code: Enums.ErrorCode.APPEND_FILE_ERROR, message: "Failed to write log to file" } };
    }
  }

  /**
 * Method for searching logs by tags.
 * @param tags - The tags to search by.
 * @returns {Promise<LogEntry[]>} - A promise that resolves with an array of log entries matching the tags.
 */
  public async searchLogsByTags(tags: string[]): Promise<LogEntry[]> {
    const logEntries: LogEntry[] = [];
    const logFiles = await this.getLogFiles();

    for (const file of logFiles) {
      const logs = await this.readLogFile(file);
      for (const log of logs) {
        if (tags.every(tag => log.tags.includes(tag))) {
          logEntries.push(log);
        }
      }
    }

    return logEntries;
  }

  /**
   * Method for filtering logs by tags.
   * @param tags - The tags to filter by.
   * @returns {Promise<LogEntry[]>} - A promise that resolves with an array of log entries matching the tags.
   */
  public async filterLogsByTags(tags: string[]): Promise<LogEntry[]> {
    const logEntries: LogEntry[] = [];
    const logFiles = await this.getLogFiles();

    for (const file of logFiles) {
      const logs = await this.readLogFile(file);
      for (const log of logs) {
        if (tags.some(tag => log.tags.includes(tag))) {
          logEntries.push(log);
        }
      }
    }

    return logEntries;
  }

  /**
   * Helper method to get all log files.
   * @returns {Promise<string[]>} - A promise that resolves with an array of log file paths.
   */
  private async getLogFiles(): Promise<string[]> {
    const logDir = resolve(baseLogPath);
    const files = await readdir(logDir);
    return files.filter(file => file.endsWith('.log')).map(file => resolve(logDir, file));
  }

  /**
   * Helper method to read a log file and parse its entries.
   * @param filePath - The path to the log file.
   * @returns {Promise<LogEntry[]>} - A promise that resolves with an array of log entries.
   */
  private async readLogFile(filePath: string): Promise<LogEntry[]> {
    const fileContent = await readFile(filePath, 'utf-8');
    const logEntries: LogEntry[] = fileContent.split('\n').filter(line => line.trim()).map(line => JSON.parse(line));

    return logEntries;
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
    const category = this.category.toLowerCase();
    const checkFolder = await this.fileValidator.checkFolder(category);
    const logs = this.logs;
    const line = LogFormatter.formattingLineType(this.inline);

    if (checkFolder.error) {
      error(`AbstractLog.log: ${checkFolder.error.message}`);
    }

    try {
      await this.addLog(text, type);

      if (logs) {
        LogFormatter.formattingConsole({ message: text, type, category, event: this.event, logs, line });
      }
    } catch (e) {
      error("BaseLog.log:", e);
      await this.addLog(e, LogType.Error);
    }
  }





  /**
   * Helper method to get the current log file path based on the current date.
   * The path is in the format of `${baseLogPath}/${month}.${year}/${day}.log`.
   * @returns {string} The current log file path.
   * @private
   */
  private getCurrentLogPath(): string {
    const now = new Date();
    const monthYear = `${(now.getMonth() + 1).toString().padStart(2, "0")}.${now.getFullYear()}`;
    const сurrentDay = `${now.getDate()}`.padStart(2, "0");

    return `${baseLogPath}/${monthYear}/${сurrentDay}.log`;
  }

}
