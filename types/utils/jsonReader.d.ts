import type { ClassWithValidator, Result } from "./file";

export interface IJSONReadFile {
  readFile<T extends object>(filePath: string): Promise<Result<T>>;
}

export interface IJSONReadLine {
  readLines<T extends object>(
    filePath: string,
    delimiter: string,
  ): Promise<Result<T>[]>;
}

export interface IJSONParse {
  parse<T = unknown>(jsonParse: string): Result<T>;
}

export interface IJSONReader
  extends IJSONReadFile,
  IJSONReadLine,
  IJSONParse,
  ClassWithValidator { }
