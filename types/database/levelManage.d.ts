import type { GlobalLevel, LocalLevel } from "@prisma/client";

/**
 * Interface for adding a new Global/Local Level in database.
 */
export interface CreateLevelOptions {
  /**
   * Id discord user
   * @type {string}
   */
  id: string;
  /**
   * id discord guild
   */
  guildId: string;
}

export type UpdateGlobalLevelData = Partial<Omit<GlobalLevel, "id">>;
export type UpdateLocalLevelData = Partial<
  Omit<LocalLevel, "id" | "userId" | "guildId">
>;
export type UpdateLevelLogicData =
  | UpdateGlobalLevelData
  | UpdateLocalLevelData;
export type UpdateLevelType = "global" | "local";

interface IUpdateLevelType {
  /**
   * Type of table. Global or Local Level table
   */
  type: UpdateLevelType;
}

export interface UpdateLocalLevelOptions extends BaseUpdateLevelOptions {
  /**
   * Type of table. LocalLevel table
   */
  type: "local";
}

export interface UpdateGlobalLevelOptions extends BaseUpdateLevelOptions {
  /**
   * Type of table. GlobalLevel table
   */
  type: "global";
}

export interface UpdateLevelOptions extends IUpdateLevelType, BaseUpdateLevelOptions { }

interface BaseUpdateLevelOptions {
  /**
   * Id discord user or localLevel table
   */
  id: string;
  /**
   * Id discord guild (sever)
   */
  guildId: string;
  /**
   * Data to update level
   */
  data: UpdateLevelLogicOptions;
}
