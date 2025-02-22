import type { ClassWithValidator, Result } from "./file";

export interface IFileManager extends ClassWithValidator {
  createFolder(
    path: string,
    folderName: string,
  ): Promise<Result<{ path: string }>>;
  deleteFile(fileName: string): Promise<Result>;
  appendFile(fileName: string, data: string): Promise<Result<void>>;
  writeFile(filePath: string, data: string): Promise<Result<void>>;
}
