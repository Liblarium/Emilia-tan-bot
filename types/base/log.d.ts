export type TypeText = string | number | object | any[];
export enum TypeLogEnum {
  info = 0 | 1,
  error = 2,
  warning = 3,
  debug = 4,
  test = 5,
}
export type TypeLog = `info` | `error` | `warning` | `debug` | `test` | TypeLogEnum;
export type TypeInline = 0 | 1 | 2 | 3;
export type LineType = `` | `\n`;
export type BaseLogOptions = { text: TypeText; type: TypeLog; event: boolean; logs: boolean; inline: TypeInline };

export interface IBaseLog {
  text: TypeText;
  logs: boolean;
  type: TypeLog;
  event: boolean;
  inline: TypeInline;
  category: string;

  setType: (type: TypeLog | undefined) => void;
  setCategory: (category: string) => void;
  setLogs: (logs: boolean) => void;
  checkLog: (names: string) => Promise<boolean>;
  createFolder: (path: string) => Promise<true | null>;
  checkFolder: (folder: string) => Promise<boolean | null>;
  addLog: (test: TypeText, logType: TypeLog) => Promise<true | null>;
  deleteFile: (fileName: string) => Promise<boolean | null>;
  setEvent: (event: boolean) => void;
  setInline: (inline: TypeInline) => void;
  log: () => Promise<void>;
}
