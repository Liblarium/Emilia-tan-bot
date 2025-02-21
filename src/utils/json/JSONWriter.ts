import type { Result } from "@type/utils/file";
import type { IJSONWriter } from "@type/utils/jsonWriter";

export class JSONWriter implements IJSONWriter {
  writeFile<T extends object>(filePath: string, data: T): Promise<Result<T>> {
    throw new Error("Method not implemented.");
  }
  appendLine<T extends object>(filePath: string, data: T, delimiter?: string): Promise<Result> {
    throw new Error("Method not implemented.");
  }
  stringify<T extends object>(data: T, pretty?: boolean): Result<string> {
    throw new Error("Method not implemented.");
  }
}
