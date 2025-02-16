import { Formatters } from "@utils";
import { AddLogResult, BaseLogOptions, TypeLog, TypeText } from "@type/constants/log";
import { InlineType, LogType } from "../enum";
import { FileHandler } from "@handlers/FileHandler";

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
   * Constructs an instance of the AbstractLog class.
   * 
   * @param {BaseLogOptions} options - The options for configuring the log.
   * @param {string} [options.text="{Nothing specified}"] - The text of the log entry.
   * @param {LogType} [options.type=LogType.Info] - The type of the log entry.
   * @param {boolean} [options.event=false] - Indicates if the log entry is an event.
   * @param {boolean} [options.logs=true] - Indicates if logging is enabled.
   * @param {number} [options.inline=0] - The inline level of the log entry.
   */
  constructor({ text = "{Nothing specified}", type = LogType.Info, event = false, logs = true, inline = 0 }: BaseLogOptions) {
    this.text = text;
    this.logs = logs;
    this.type = type;
    this.inline = inline;
    this.event = event;
    this.category = "other";

    // The method is asynchronous, so it must be called in the constructor using `.catch()`
    this.initialize().catch(error);
  }

  /**
   * Initialize the log by checking and creating the base log folder if necessary.
   * @returns {Promise<void>}
   */
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
  protected setCategory(category: string): void { if (typeof category === "string") this.category = category; }

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

    const appendFile = await FileHandler.appendFile(`${baseLogPath}/${category}/${category}-${date()}.log`, LogFormatter.formatterLog({ text, type, category }));

    if (appendFile.error) {
      error(appendFile.error);
      return {
        success: false,
        error: "Failed to write log to file",
      };
    }

    return { success: true };
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
