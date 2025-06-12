import type { ClassWithValidator, Result } from "@type";
import type { Observable } from "rxjs";

export interface IJSONReadFile {
  readFile<T extends object>(filePath: string): Observable<Result<T>>;
}

export interface IJSONReadLine {
  readLines<T extends object>(filePath: string, delimiter: string): Promise<Result<T>[]>;
}

export interface IJSONParse {
  multiParse<T = unknown>(jsonParse: string): Result<T>[];
  parse<T = unknown>(jsonParse: string): Result<T>;
}

export interface IJSONReader extends IJSONReadFile, IJSONReadLine, IJSONParse, ClassWithValidator {}
