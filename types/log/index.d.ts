import { ArrayNotEmpty } from "..";
import type { TypeInline, TypeLog, TypeText } from "../base/log";

export interface LogOptions {
  text: TypeText;
  type: TypeLog;
  categories: ArrayNotEmpty<string>;
  event?: boolean;
  db?: boolean;
  logs?: boolean;
  inline?: TypeInline
}
export { TypeText, TypeLog, TypeInline };
export interface ILog {
  text: TypeText;
  type: TypeLog;
  logs: boolean;
  inline: TypeInline;
  db: boolean;
}
