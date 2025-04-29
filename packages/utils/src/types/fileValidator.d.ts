import type { Observable } from "rxjs";
import type { ErrorDetails, Result } from "./";

export interface IFormatValidator {
  checkFormatFile(filePath: string): Promise<Result>;
}

export interface IFileAccessValidator {
  validateFileOperation(filePath: string): Promise<Observable<Result>>;
}

// checkFolder. Interface for method
export interface ICheckFolder {
  checkFolder(folderPath: string): Promise<FolderCheckResult>;
}

export interface IValidPath {
  isValidPath(filePath: string): Observable<boolean>;
}

export interface IJSONFile {
  isJSONFile(path: string): boolean;
}

export interface IFileValidator
  extends IFormatValidator,
  IFileAccessValidator,
  ICheckFolder,
  IValidPath,
  IJSONFile { }

/**
 * Result of checking a folder
 */
export interface FolderCheckResult {
  /**
   * Whether the folder exists
   */
  exists: boolean;
  /**
   * Whether the folder is writable
   */
  writable: boolean;
  /**
   * The error message if the check failed
   */
  error: ErrorDetails | undefined;
}
