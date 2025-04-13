import { db } from "@client";
import { ErrorCode } from "@enum/errorCode";
import { LogType } from "@enum/log";
import { Log } from "@log";
import type {
  ArrayNotEmpty,
  CreateLevelOptions,
  IGlobalLevel,
  ILocalLevel,
  UpdateGlobalLevelOptions,
  UpdateLevelData,
  UpdateLevelType,
  UpdateLocalLevelOptions,
} from "@type";
import { LogMethod, Loggable } from "@utils/decorators/loggable";
import { emiliaError } from "@utils/error/EmiliaError";
import { stringToBigInt } from "@utils/transform/stringToBigInt";

/**
 * Handles the logic for managing levels in the database.
 */
@Loggable(Log, { text: "", categories: ["database", "level"], type: LogType.Info, tags: ["database", "level"], code: ErrorCode.OK })
export class LevelManager {
  public readonly logCategories: ArrayNotEmpty<string> = ["database", "level"];

  /**
   * The next time (in milliseconds) that the user can gain experience points.
   * This is set to 30 seconds after the current time.
   * @returns The next time in milliseconds as a BigInt.
   */
  private get getNextXpTime(): bigint {
    return stringToBigInt((Date.now() + 30 * 1000).toString());
  }

  /**
   * Creates a new level entry in the database for a user, either globally or locally within a guild.
   *
   * @param options - The options for creating the level.
   * @param options.id - The unique identifier of the user.
   * @param options.guildId - The unique identifier of the guild.
   * @returns A promise that resolves when the create operation is complete.
   */

  public async createLevel({ id, guildId }: CreateLevelOptions) {
    const guildCheck = await this.guildCheck(guildId);

    if (!guildCheck) return; // if not found or see in guildCheck method

    const [globalLevel, localLevel] = await Promise.all([
      this.getGlobalLevelId(id),
      this.getLocalLevelId(id, guildId),
    ]);

    // Create on Global/LocalLevel table new user if not found
    if (!globalLevel && guildCheck.globalLevel)
      await this.createGlobalLevel(stringToBigInt(id));
    if (!localLevel && guildCheck.levelModule)
      await this.createLocalLevel(
        stringToBigInt(id),
        stringToBigInt(guildId),
      );

    // Or Ignored both tables
  }

  /**
   * Updates the global level for a user. If the user does not exist in the
   * global level table, a new entry is created. Otherwise, the existing
   * entry is updated with the new data.
   *
   * @param {UpdateGlobalLevelOptions} options - The options for the update.
   * @param {string} options.id - The unique identifier of the user.
   * @param {UpdateGlobalLevelData} options.data - The data to be updated in the level record.
   * @throws {Error} If the id is empty or data object is empty.
   * @returns A promise that resolves when the update operation is complete.
   */
  @LogMethod({ type: LogType.Info, tags: ["database", "level"], categories: ["database", "level"] })
  public async updateGlobalLevel({
    id,
    data,
  }: UpdateGlobalLevelOptions): Promise<void> {
    const globalLevel = await this.getGlobalLevelId(id);

    if (globalLevel) {
      await this.updateLevelLogic(id, "global", data);
    } else {
      await this.createGlobalLevel(stringToBigInt(id));
    }
  }

  @LogMethod({ type: LogType.Info, tags: ["database", "level"], categories: ["database", "level"] })
  public async updateLocalLevel({
    id,
    guildId,
    data,
  }: UpdateLocalLevelOptions): Promise<void> {
    const localLevel = await this.getLocalLevelId(id, guildId);

    if (localLevel) {
      await this.updateLevelLogic(localLevel.id.toString(), "local", data);
    } else {
      await this.createLocalLevel(
        stringToBigInt(id),
        stringToBigInt(guildId),
      );
    }
  }

  /**
   * Updates the level logic for a user, either globally or locally.
   *
   * @param id - The unique identifier of the user or local level entry.
   * @param type - The type of update, either "global" or "local".
   * @param data - The data to be updated in the level record.
   * @throws {Error} If the id is empty or data object is empty.
   * @returns A promise that resolves when the update operation is complete.
   */
  @LogMethod({ type: LogType.Info, tags: ["database", "level"], categories: ["database", "level"] })
  private async updateLevelLogic(
    id: string,
    type: UpdateLevelType,
    data: UpdateLevelData,
  ): Promise<void> {
    if (!id || id.length === 0)
      throw emiliaError(
        "[LevelManager.updateLevel(logic)]: Id is required!",
        ErrorCode.ARGS_REQUIRED,
        "TypeError",
      );
    if (!data || Object.keys(data).length === 0)
      throw emiliaError(
        "[LevelManager.updateLevel(logic)]: Data is required!",
        ErrorCode.ARGS_REQUIRED,
        "TypeError",
      );

    // This is a place to "choose" which table with levels will be updated. In our case it is Global and Local
    const updater: IGlobalLevel | ILocalLevel =
      type === "global" ? db.globalLevel : db.localLevel;

    // Update the level in the chosen table, select only the id column to return it.
    await updater.update({
      where: { id: stringToBigInt(id) },
      data,
      select: { id: true },
    });
  }

  /**
   * Deletes the global level information for a user.
   *
   * @param id - The unique identifier of the user as a string.
   * @throws {TypeError} If the id is empty or not provided.
   * @returns A promise that resolves when the delete operation is complete.
   */
  @LogMethod({ type: LogType.Info, tags: ["database", "level"], categories: ["database", "level"] })
  public async deleteGlobalLevel(id: string) {
    if (!id || id.length === 0)
      throw emiliaError(
        "[LevelManager.deleteGlobalLevel]: Id is required!",
        ErrorCode.ARGS_REQUIRED,
        "TypeError",
      );

    await db.globalLevel.delete({
      where: { id: stringToBigInt(id) },
    });
  }

  /**
   * Deletes the local level information for a user in a specific guild.
   *
   * @param id - The unique identifier of the user as a string.
   * @param guildId - The unique identifier of the guild as a string.
   * @throws {TypeError} If the id or guildId is empty or not provided.
   * @returns A promise that resolves when the delete operation is complete.
   */
  @LogMethod({ type: LogType.Info, tags: ["database", "level"], categories: ["database", "level"] })
  public async deleteLocalLevel(id: string, guildId: string) {
    if (!id || id.length === 0)
      throw emiliaError(
        "[LevelManager.deleteLocalLevel]: Id is required!",
        ErrorCode.ARGS_REQUIRED,
        "TypeError",
      );
    if (!guildId || guildId.length === 0)
      throw emiliaError(
        "[LevelManager.deleteLocalLevel]: GuildId is required!",
        ErrorCode.ARGS_REQUIRED,
        "TypeError",
      );

    const localLevel = await this.getLocalLevelId(id, guildId);

    if (!localLevel) return;

    await db.localLevel.delete({ where: { id: localLevel.id } });
  }

  /**
   * Gets the global level ID for a user by their unique identifier.
   *
   * @param id - The unique identifier of the user as a string.
   * @throws {TypeError} If the id is empty or not provided.
   * @returns A promise that resolves with the global level ID as a BigInt.
   */
  @LogMethod({ type: LogType.Info, tags: ["database", "level"], categories: ["database", "level"] })
  private async getGlobalLevelId(id: string) {
    if (!id || id.length === 0)
      throw emiliaError(
        "[LevelManager.getGlobalLevelId]: Id is required!",
        ErrorCode.ARGS_REQUIRED,
        "TypeError",
      );

    const bigId = stringToBigInt(id);

    return db.globalLevel.findFirst({
      where: { id: bigId },
      select: { id: true },
    });
  }

  /**
   * Gets the local level ID for a user in a specific guild by their unique identifier and guild ID.
   *
   * @param id - The unique identifier of the user as a string.
   * @param guildId - The unique identifier of the guild as a string.
   * @throws {TypeError} If the id or guildId is empty or not provided.
   * @returns A promise that resolves with the local level ID as a BigInt.
   */
  @LogMethod({ type: LogType.Info, tags: ["database", "level"], categories: ["database", "level"] })
  private async getLocalLevelId(id: string, guildId: string) {
    if (!id || !guildId || id.length === 0 || guildId.length === 0)
      throw emiliaError(
        "[LevelManager.getLocalLevelId]: id and guildId is required!",
        ErrorCode.ARGS_REQUIRED,
        "TypeError",
      );

    const bigId = stringToBigInt(id);
    const bigGuildId = stringToBigInt(guildId);

    const AND: ({ userId: bigint } | { guildId: bigint })[] = [
      { userId: bigId },
      { guildId: bigGuildId },
    ];

    return db.localLevel.findFirst({ where: { AND }, select: { id: true } });
  }

  /**
   * Checks the guild settings for a given guild ID.
   *
   * @param id - The unique identifier of the guild as a string.
   * @returns A Promise that resolves to an object containing the guild's level settings:
   *          - globalLevel: Whether global leveling is enabled.
   *          - levelModule: Whether the level module is enabled.
   *          - addInBD: Whether the guild is added to the database.
   *          Returns null if the guild is not found.
   */
  @LogMethod({ type: LogType.Info, tags: ["database", "level"], categories: ["database", "level"] })
  private async guildCheck(id: string) {
    const guild = await db.guild.findUnique({
      where: { id: stringToBigInt(id) },
      select: { globalLevel: true, levelModule: true, addInBD: true },
    });

    // if not found guild or or this server (owner) does not want to add users to the database
    if (!guild || !guild.addInBD) return null;

    return { globalLevel: guild.globalLevel, levelModule: guild.levelModule };
  }

  /**
   * Creates a new global level entry for a user.
   *
   * @param id - The unique identifier of the user as a bigint.
   * @throws {Error} Throws an error if the id is not provided.
   * @returns A promise that resolves to the created global level entry with its id.
   */
  @LogMethod({ type: LogType.Info, tags: ["database", "level"], categories: ["database", "level"] })
  private async createGlobalLevel(id: bigint) {
    await db.globalLevel.create({
      data: {
        id,
        nextXp: this.getNextXpTime,
        user: { connect: { id } },
      },
      select: { id: true }, // One information element
    });
  }

  /**
   * Creates a new local level entry for a user in a specific guild.
   *
   * @param id - The unique identifier of the user.
   * @param guildId - The unique identifier of the guild.
   *
   * @throws Will throw an error if either `id` or `guildId` is not provided.
   *
   * @returns A promise that resolves to the created local level entry with its `id`.
   */
  @LogMethod({ type: LogType.Info, tags: ["database", "level"], categories: ["database", "level"] })
  private async createLocalLevel(id: bigint, guildId: bigint) {
    if (!id)
      throw emiliaError("[LevelManager.createLevel(local)]: Id is required!", ErrorCode.ARGS_REQUIRED);
    if (!guildId)
      throw emiliaError("[LevelManager.createLevel(local)]: GuildId is required!", ErrorCode.ARGS_REQUIRED);

    await db.localLevel.create({
      data: {
        userId: id,
        guildId,
        level: 0,
        xp: 0,
        maxXp: 150,
        nextXp: this.getNextXpTime,
        User: { connect: { id } },
        Guild: { connect: { id: guildId } },
      },
      select: { id: true }, // One information element
    });
  }
}
