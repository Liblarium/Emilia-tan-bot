export type TypeText = string | number | object | unknown[] | unknown;
export enum TypeLogEnum {
  info = 0 | 1,
  error = 2,
  warning = 3,
  debug = 4,
  test = 5,
}
export type TypeLog = "info" | "error" | "warning" | "debug" | "test" | TypeLogEnum;
export type TypeInline = 0 | 1 | 2 | 3;
export type LineType = "" | "\n";
export interface BaseLogOptions {
  /**
   * Text which will be written to log
   */
  text: TypeText;
  /**
   * Type of log
   */
  type: TypeLog;
  /**
   * Event mode. If true, log will be written in format: [time] [category] [type]: text
   */
  event: boolean;
  /**
   * If true, log will be written to console
   */
  logs: boolean;
  /**
   * Inline mode. If 0 - no inline, if 1 - add new line at start, if 2 - add new line at end, if 3 - add new lines at start and end
   */
  inline: TypeInline
}

export interface IBaseLog {
  /**
   * Text which will be written to log
   */
  text: TypeText;
  /**
   * If true, log will be written to console
   */
  logs: boolean;
  /**
   * Type of log
   */
  type: TypeLog;
  /**
   * Event mode. If true, log will be written in format: [time] [category] [type]: text
   */
  event: boolean;
  /**
   * Inline mode. If 0 - no inline, if 1 - add new line at start, if 2 - add new line at end, if 3 - add new lines at start and end
   */
  inline: TypeInline;
  /**
   * Category of log
   */
  category: string;

  /**
   * Method for change number value of type to string
   * @param {TypeLog | undefined} type
   */
  setType: (type: TypeLog | undefined) => void;
  /**
   * Method for change category of log
   * @param {string} category
   */
  setCategory: (category: string) => void;
  /**
   * Method for enable/disable log writing to console
   * @param {boolean} logs
   */
  setLogs: (logs: boolean) => void;
  /**
   * Method for check if log file exists
   * @param {string} names
   * @returns {Promise<boolean>}
   */
  checkLog: (names: string) => Promise<boolean>;
  /**
   * Method for create log folder
   * @param {string} path
   * @returns {Promise<true | null>}
   */
  createFolder: (path: string) => Promise<true | null>;
  /**
   * Method for check if log folder exists. If not, create folder
   * @param {string} folder
   * @returns {Promise<boolean | null>}
   */
  checkFolder: (folder: string) => Promise<boolean | null>;
  /**
   * Method for add log to file
   * @param {TypeText} text
   * @param {TypeLog} logType
   * @returns {Promise<true | null>}
   */
  addLog: (test: TypeText, logType: TypeLog) => Promise<true | null>;
  /**
   * Method for delete file of log
   * @param {string} fileName
   * @returns {Promise<boolean | null>}
   */
  deleteFile: (fileName: string) => Promise<boolean | null>;
  /**
   * Method for enable/disable event mode
   * @param {boolean} event
   */
  setEvent: (event: boolean) => void;
  /**
   * Method for change inline mode
   * @param {TypeInline} inline
   */
  setInline: (inline: TypeInline) => void;
  /**
   * Method for write log to console and file
   * @returns {Promise<void>}
   */
  log: () => Promise<void>;
}
