import type { IFileManager } from "./fileManager";
import type { IFileValidator } from "./fileValidator";

export type Result<T = void> = { success: true; data?: T } | { success: false; error: string | undefined };
export type ClassWithValidator = { fileValidator: IFileValidator };
export type ClassWithFileManager = { fileManager: IFileManager }; 