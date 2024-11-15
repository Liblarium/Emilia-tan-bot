/**
 * This file used for optional types for srcTs/database/schema/*.ts
 */

export interface Level {
  xp: number;
  level: number;
  maxXp: number;
  nextXp: bigint;
}
