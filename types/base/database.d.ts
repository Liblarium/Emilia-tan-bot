import type { LogOptions } from "@type/log";
import type { DostupSelect, GlobalLevelSelect, GuildSelect, LocalLevelSelect, UserSelect } from ".prisma/client/index.d";

interface DatabaseSelect {
  user: UserSelect;
  guild: GuildSelect;
  globalLevel: GlobalLevelSelect;
  localLevel: LocalLevelSelect;
  dostup: DostupSelect;
};

type DatabaseTables = "user" | "guild" | "globalLevel" | "localLevel" | "dostup";
type Select<T extends DatabaseTables> = Pick<DatabaseSelect, T>;


export interface FindOrCreateOptionalOptions<T extends DatabaseTables = "user"> {
  select?: Select | null;
  log?: LogOptions;
}

export interface LevelValue {
  xp: number;
  level: number;
  maxXp: number;
}

export interface DostupValues {
  base?: string;
  reader?: string;
  additionalAccess?: string[];
  maxRank?: number;
}

export type EditedDostupValues = Omit<DostupValues, "additionalAccess"> & { additionalAccess: string }