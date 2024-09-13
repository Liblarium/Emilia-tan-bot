import type { ArrayNotEmpty } from "@type";
import type { TypeInline, TypeLog, TypeText } from "@type/base/log";

export interface LogOptions {
  text: TypeText;
  type: TypeLog;
  categories: ArrayNotEmpty<string>;
  event?: boolean;
  logs?: boolean;
  inline?: TypeInline;
}
export type { TypeText, TypeLog, TypeInline };
export interface ILog {
  text: TypeText;
  type: TypeLog;
  logs: boolean;
  inline: TypeInline;
}
