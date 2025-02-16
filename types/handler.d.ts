import type { Abstract } from "@constants";

export type ModuleType = Abstract.AbstractEvent | Abstract.AbstractBaseCommand;

/**
 * Result of creating a folder
 */
export interface CreateFolderResult {
  /**
   * Whether the creation was successful
   */
  success: boolean;
  /**
   * The error message if the creation failed
   */
  error?: string;
  /**
   * The path to the created folder
   */
  path?: string;
}

/**
 * Result of appending data to a file
 */
export interface AppendFileResult {
  /**
   * Whether the append operation was successful
   */
  success: boolean;
  /**
   * The error message if the append operation failed
   */
  error?: string;
}

/**
 * Result of deleting a file
 */
export interface DeleteFileResult {
  /**
   * Whether the deletion was successful
   */
  success: boolean;
  /**
   * The error message if the deletion failed
   */
  error?: string;
}

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
  error?: string;
}

/**
 * Result of checking file format
 */
export interface CheckFormatFileResult {
  /**
   * Whether the format check was successful
   */
  success: boolean;
  /**
   * The error message if the format check failed
   */
  error?: string;
}

/**
 * Type for guild prefix in database
 */
export type GuildPrefix = { now: string, default: string }