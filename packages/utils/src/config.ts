import type { ArrayMaybeEmpty, ArrayNotEmpty } from "@emilia-tan/types";

/**
 * File formats not allowed extensions
 */
export const FORBIDDEN_EXTENSIONS: Readonly<ArrayNotEmpty<string>> = [
  ".js",
  ".ts",
  ".d.ts",
  ".json",
];

/**
 * File formats allowed extensions
 */
export const ALLOWED_EXTENSIONS: Readonly<ArrayNotEmpty<string>> = [".txt", ".log"];
/**
 * Folders not allowed
 */
export const FORBIDDEN_FOLDERS: Readonly<ArrayNotEmpty<string>> = [
  "node_modules",
  "dist",
  "prisma",
  ".git",
  ".vscode",
  "types",
  "pgdata",
  "oldCode",
  "sandbox",
];

/**
 * Folders allowed
 */
export const ALLOWED_FOLDERS: Readonly<ArrayNotEmpty<string>> = ["logs"];
/**
 * Files not allowed
 */
export const FORBIDDEN_FILES: Readonly<ArrayNotEmpty<string>> = [
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "tsconfig.base.json",
  "biome.json",
];

/**
 * Files allowed
 *
 * Warning - this array must be empty! (is fine. I not idea for allowed files)
 */
export const ALLOWED_FILES: Readonly<ArrayMaybeEmpty<string>> = [];

/**
 * Delimiter for log file
 *
 * Use from ".log" files
 */
export const DELIMITER_LOG_FILE: Readonly<"\n"> = "\n";

/**
 * Prefix
 *
 * Default discord bot prefix
 * @type {"++"}
 */
export const prefix: Readonly<`++`> = "++";

/**
 * Default file filter for the handler
 */
export const defaultHandlerFileFilter: Readonly<RegExp> = /^[^.]+\.(js)$/;
