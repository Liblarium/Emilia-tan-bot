import type { SQL } from "drizzle-orm";

export interface Level {
  xp: number | null;
  level: number | null;
  maxXp: number | null;
  nextXp: bigint | null;
}

export interface LevelOptions {
  args: Level | undefined;
  nowMs: bigint;
  userId: bigint;
  guildId?: bigint;
  dbType: "global" | "local";
}

export interface LevelValues {
  xp: number;
  level?: SQL<unknown>,
  maxXp?: number;
  nextXp: bigint
}

export interface UserValue {
  id: bigint;
  username: string;
  dostup: bigint;
  globalLevel: bigint;
  localLevel?: bigint;
}

export type LevelReturning = { insertedId: bigint | null; }[];
