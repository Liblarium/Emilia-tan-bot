import type { Result } from "./file";
import type { IFileValidator } from "./fileValidator";

export interface IFileManager {
  createFolder(
    path: string,
    folderName: string,
  ): Promise<Result<{ path: string }>>;
  deleteFile(fileName: string): Promise<Result>;
  appendFile(fileName: string, data: string): Promise<Result>;
}
