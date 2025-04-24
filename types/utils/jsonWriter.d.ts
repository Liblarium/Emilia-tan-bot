import type { ClassWithFileManager, ClassWithValidator, Result } from "@type";
import type { Observable } from "rxjs";

export interface IJSONWriteFile {
  writeFile<T extends object>(filePath: string, data: T): Observable<Result<void>>;
}

export interface IJSONAppendLine {
  appendLine<T extends object>(
    filePath: string,
    data: T,
    delimiter: string = "\n",
  ): Observable<Result<void>>;
}

export interface IJSONStringify {
  stringify<T extends object>(data: T, pretty: boolean = false): Result<string>;
}

export interface IJSONWriter
  extends IJSONWriteFile,
  IJSONAppendLine,
  IJSONStringify,
  ClassWithFileManager,
  ClassWithValidator { }
