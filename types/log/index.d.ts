import { ArrayNotEmpty } from "..";
import { TypeInline, TypeLog, TypeText } from "../base/log";

export type LogOptions = { text: TypeText; type: TypeLog; categories: ArrayNotEmpty<string>; event?: boolean; db?: boolean; logs?: boolean; inline?: TypeInline };
export { TypeText, TypeLog, TypeInline };
export interface ILog {
  text: TypeText;
  type: TypeLog;
  logs: boolean;
  inline: TypeInline;
  db: boolean;
}
