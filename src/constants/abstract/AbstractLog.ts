import { Decorators, Formatters } from "@utils";
import { AddLogResult, BaseLogOptions, LogEntry, TypeLog, TypeText } from "@type/constants/log";
import { InlineType, LogType } from "../enum";
import { FileHandler } from "@handlers/FileHandler";
import { resolve } from "node:path";
import fs from "node:fs/promises";

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
  protected category: string;
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
  constructor({ text = "{Nothing specified}", type = LogType.Info, event = false, logs = true, inline = 0, metadata, context = {}, tags = [] }: BaseLogOptions) {
    this.text = text;
    this.logs = logs;
    this.type = type;
    this.inline = inline;
    this.event = event;
    this.category = "other";
    this.metadata = metadata;
    this.context = context;
    this.tags = tags;

    // The method is asynchronous, so it must be called in the constructor using `.catch()`
    this.initialize().catch(error);
  }

  /**
   * Initialize the log by checking and creating the base log folder if necessary.
   * @returns {Promise<void>}
   */
  @Decorators.logCaller()
  private async initialize(): Promise<void> {
    try {
      // Check if base log folder exists
      const folderCheckResult = await FileHandler.checkFolder(baseLogPath);

      // If it doesn't exist, create it
      if (!folderCheckResult.exists) {
        await FileHandler.createFolder(baseLogPath, '');
      }

      if (typeof this.type === "number") this.type = LogFormatter.formatterType(this.type) ?? LogType.Error;
    } catch (e) {
      error(`AbstractLog.initialize: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }

  /**
   * Method for change category of log
   * @param category - Category of log
   */
  protected setCategory(category: string): void {
    if (typeof category === "string") this.category = category;
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
   * import { AbstractLog } from "path/to/log/AbstractLog";
   * 
   * class Log extends AbstractLog {
   *   // your code here
   * }
   * 
   * const log = new Log({ text: "Hello from AbstractLog", type: LogType.Info });
   * const result = await log.addLog("Log message", LogType.Warning);
   * console.log(result); // { success: true }
   */
  protected async addLog(text: TypeText, logType: TypeLog): Promise<AddLogResult> {
    const editType = LogFormatter.formatterType(logType ?? this.type);

    if (!editType) return {
      success: false,
      error: "Invalid log type",
    };

    const type = editType.toString().toLowerCase();
    const category = this.category.toLowerCase();

    const logFilePath = `${baseLogPath}/${category}/${category}-${date()}.log`;
    let fullText = "";

    [text, this.metadataMerge()].forEach((data, ind) => {
      fullText += LogFormatter.formatterLog({ text: data, type: ind === 0 ? type : "metadata", category });
    });

    try {
      const appendFile = await FileHandler.appendFile(logFilePath, fullText);

      if (appendFile.error) {
        error(appendFile.error);
        return {
          success: false,
          error: "Failed to write log to file",
        };
      }

      return { success: true };
    } catch (e) {
      error(`AbstractLog.addLog: ${e instanceof Error ? e.message : 'Unknown error'}`);

      return { success: false, error: "Failed to write log to file" };
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
    const files = await fs.readdir(logDir);
    return files.filter(file => file.endsWith('.log')).map(file => resolve(logDir, file));
  }

  /**
   * Helper method to read a log file and parse its entries.
   * @param filePath - The path to the log file.
   * @returns {Promise<LogEntry[]>} - A promise that resolves with an array of log entries.
   */
  private async readLogFile(filePath: string): Promise<LogEntry[]> {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const logEntries: LogEntry[] = fileContent.split('\n').filter(line => line.trim()).map(line => JSON.parse(line));

    return logEntries;
  }

  /**
   * Merges metadata, timestamp, tags, and context into a single object.
   * 
   * This private method combines various properties of the class instance
   * into a single metadata object. It ensures that the timestamp is always
   * included, and conditionally adds tags and context if they are present.
   * 
   * @returns {object} An object containing the merged metadata under the 'metadata' key.
   *                   The returned object has the following structure:
   *                   { metadata: { ...mergedProperties } }
   */
  private metadataMerge(): { metadata: object } {
    const { metadata, timestamp, tags, context } = this;

    let metadataResult: object = metadata ? { ...metadata, timestamp } : { timestamp };

    if (tags.length > 0) metadataResult = { ...metadataResult, tags };
    if (context && Object.keys(context).length > 0) metadataResult = { ...metadataResult, context };

    return { metadata: { ...metadataResult } };
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
    const checkFolder = await FileHandler.checkFolder(category);
    const logs = this.logs;
    const line = LogFormatter.formattingLineType(this.inline);

    if (checkFolder.error) {
      error(`AbstractLog.log: ${checkFolder.error}`);
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

}
