import type { GlobalLevel, LocalLevel, Prisma } from "@prisma/client";

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

/**
 * Pick only `xp`, `level`, `maxXp`, `nextXp` from type on T.
 */
type PickLevelUpdateInput<T> = Pick<T, "xp" | "level" | "maxXp" | "nextXp">;

/**
 * GlobalLevel Model. GlobalLevelUpdateInput
 * 
 * This version Picked `xp`, `level`, `maxXp` and `nextXp` on type.
 * 
 * Use id (user.id from discord.js on message/interaction) for update this table
 */
export type UpdateGlobalLevelData = PickLevelUpdateInput<Prisma.GlobalLevelUpdateInput>;

/**
 * LocalLevel Model. LocalLevelUpdateInput
 * 
 * This version Picked `xp`, `level`, `maxXp` and `nextXp` on type.
 * 
 * Use id (`getLocalId` (private method), or `db.localLevel.findUnique({ where: { AND: [{ userId, guildId }] }, select: { id: true } })`) for update this table
 */
export type UpdateLocalLevelData = PickLevelUpdateInput<Prisma.LocalLevelUpdateInput>;

/**
 * Interface for the GlobalLevel and LocalLevel table.
 */
export type UpdateLevelData =
  | UpdateGlobalLevelData
  | UpdateLocalLevelData;

/**
 * Type on update GlobalLevel or LocalLevel.
 */
export type UpdateLevelType = "global" | "local";

export interface UpdateLocalLevelOptions extends BaseUpdateLevelOptions {
  data: UpdateLocalLevelData;
}

export interface UpdateGlobalLevelOptions extends BaseUpdateLevelOptions {
  data: UpdateGlobalLevelData;
}

export interface UpdateLevelOptions extends BaseUpdateLevelOptions {
  /**
   * Type of table. Global or Local Level table
   */
  type: UpdateLevelType;
}

/**
 * Interface with parameters to update levels in Global/Local Levels.
 */
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
  data: UpdateLevelData;
}

/**
 * Interface for the GlobalLevel table.
 * @interface IGlobalLevel
 */
export interface IGlobalLevel {
  /**
   * Update GlobalLevel table in database.
   * @param {Object} data - Data to update GlobalLevel table.
   * @property {Object} where - Where clause for update query.
   * @property {bigint} where.id - Id discord user.
   * @property {Object} data - Data to update GlobalLevel table.
   * @property {UpdateGlobalLevelData} data - Data to update GlobalLevel table.
   * @property {Object} select - Select clause for update query.
   * @property {boolean} select.id - Select id column.
   * @returns {Promise<{id: bigint}>} - Promise with id of updated GlobalLevel.
   */
  update(data: { where: { id: bigint }, data: UpdateGlobalLevelData, select: { id: true } }): Promise<{ id: bigint }>;
}

/**
 * Interface for the LocalLevel table.
 * @interface ILocalLevel
 */
export interface ILocalLevel {
  /**
   * Update LocalLevel table in database.GlobalLevelUpdateInput
   * @param {Object} data - Data to update LocalLevel table.
   * @property {Object} where - Where clause for update query.
   * @property {bigint} where.id - Id discord user.
   * @property {Object} data - Data to update LocalLevel table.
   * @property {UpdateLocalLevelData} data - Data to update LocalLevel table.
   * @property {Object} select - Select clause for update query.
   * @property {boolean} select.id - Select id column.
   * @returns {Promise<{id: bigint}>} - Promise with id of updated LocalLevel.
   */
  update(data: { where: { id: bigint }, data: UpdateLocalLevelData, select: { id: true } }): Promise<{ id: bigint }>;
}