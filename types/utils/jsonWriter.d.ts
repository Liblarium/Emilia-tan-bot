import type { Result } from "./file";

export interface IJSONWriteFile {
  writeFile<T extends object>(filePath: string, data: T): Promise<Result<T>>;
}

export interface IJSONAppendLine {
  appendLine<T extends object>(
    filePath: string,
    data: T,
    delimiter: string = "\n",
  ): Promise<Result>;
}

export interface IJSONStringify {
  stringify<T extends object>(data: T, pretty: boolean = false): Result<string>;
}

export interface IJSONWriter
  extends IJSONWriteFile,
  IJSONAppendLine,
  IJSONStringify { }
