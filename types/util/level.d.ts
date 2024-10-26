import type { SQL } from "drizzle-orm";
/**
 * Interface for a level in the database
 */
export interface Level {
  /**
   * The current experience points
   */
  xp: number | null;
  /**
   * The current level
   */
  level: number | null;
  /**
   * The maximum experience points for the current level
   */
  maxXp: number | null;
  /**
   * The experience points needed for the next level
   */
  nextXp: bigint | null;
}

/**
 * Options for calculating a level
 */
export interface LevelOptions {
  /**
   * The current level data
   */
  args: Level | undefined;
  /**
   * The user ID
   */
  userId: bigint;
  /**
   * The guild ID (optional)
   */
  guildId?: bigint;
  /**
   * The type of level to calculate (global or local)
   */
  dbType: "global" | "local";
  /**
   * The local level ID (optional)
   */
  localLevelId?: bigint;
}

/**
 * The values returned from calculating a level
 */
export interface LevelValues {
  /**
   * The current experience points
   */
  xp: number;
  /**
   * The current level
   */
  level?: SQL<unknown>;
  /**
   * The maximum experience points for the current level
   */
  maxXp?: number;
  /**
   * The experience points needed for the next level
   */
  nextXp: bigint;
}

/**
 * The values returned from the database for a user
 */
export interface UserValue {
  /**
   * The user ID
   */
  id: bigint;
  /**
   * The username
   */
  username: string;
  /**
   * The user's dostup
   */
  dostup: bigint;
  /**
   * The user's global level
   */
  globalLevel: bigint;
  /**
   * The user's local level (optional)
   */
  localLevel?: bigint;
}
