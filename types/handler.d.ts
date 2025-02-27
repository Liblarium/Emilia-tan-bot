import type { Abstract } from "@constants";

export type ModuleType<T extends Abstract.AbstractEvent | Abstract.AbstractBaseCommand> = T;

/**
 * Type for guild prefix in database
 */
export type GuildPrefix = { now: string, default: string }

/**
 * Result of reading a JSON file
 * 
 * @template T - The type of the JSON object
 */
export type ReadJSONFileResult<T extends object = object> = T | { error: string };