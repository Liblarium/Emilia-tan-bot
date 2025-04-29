import type { Observable } from "rxjs";
import type { ClassWithFileManager, ClassWithValidator, Result } from ".";

export interface IJSONWriteFile {
  writeFile<T extends object>(filePath: string, data: T): Observable<Result<void>>;
}

export interface IJSONAppendLine {
  appendLine<T extends object>(
    filePath: string,
    data: T,
    delimiter: string,
  ): Observable<Result<void>>;
}

export interface IJSONStringify {
  stringify<T extends object>(data: T, pretty?: boolean): Result<string>;
}

export interface IJSONWriter
  extends IJSONWriteFile,
  IJSONAppendLine,
  IJSONStringify,
  ClassWithFileManager,
  ClassWithValidator { }
