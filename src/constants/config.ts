import type { ArrayMaybeEmpty, ArrayNotEmpty } from "@type";

/**
 * File formats not allowed extensions
 */
export const FORBIDDEN_EXTENSIONS: ArrayNotEmpty<string> = [".js", ".ts", ".d.ts", ".json"];

/**
 * File formats allowed extensions
 */
export const ALLOWED_EXTENSIONS: ArrayNotEmpty<string> = [".txt", ".log"];
/**
 * Folders not allowed
 */
export const FORBIDDEN_FOLDERS: ArrayNotEmpty<string> = ["node_modules", "dist", "prisma", ".git", ".vscode", "types", "pgdata", "oldCode", "sanbox"];

/**
 * Folders allowed
 */
export const ALLOWED_FOLDERS: ArrayNotEmpty<string> = ["logs"];
/**
 * Files not allowed
 */
export const FORBIDDEN_FILES: ArrayNotEmpty<string> = ["package.json", "package-lock.json", "tsconfig.json", "tsconfig.base.json", "biome.json"];

/**
 * Files allowed
 * 
 * Warning - this array must be empty! (is fine. I not idea for allowed files)
 */
export const ALLOWED_FILES: ArrayMaybeEmpty<string> = [];

/**
 * Delimiter for log file
 * 
 * Use from ".log" files
 */
export const DELIMITER_LOG_FILE = "\n";

/**
 * Prefix
 * 
 * Defalt discord bot prefix
 * @type {"++"}
 */
export const prefix: `++` = "++";