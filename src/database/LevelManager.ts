import { Decorators, emiliaError, Transforms } from "@utils";
import { db } from "@client";
import { CreateLevelOptions, UpdateGlobalLevelOptions, UpdateLevelLogicData, UpdateLevelOptions, UpdateLevelType, UpdateLocalLevelOptions } from "@type/database/levelManage";

export class LevelManager {
  /**
   * The next time (in milliseconds) that the user can gain experience points.
   * This is set to 30 seconds after the current time.
   * @returns The next time in milliseconds as a BigInt.
   */
  private get getNextXpTime(): bigint {
    return Transforms.stringToBigInt((Date.now() + (30 * 1000)).toString());
  }

  /**
   * Creates a new level entry in the database for a user, either globally or locally within a guild.
   * 
   * @param options - The options for creating the level.
   * @param options.id - The unique identifier of the user.
   * @param options.guildId - The unique identifier of the guild.
   * @returns A promise that resolves when the create operation is complete.
   */
  @Decorators.logCaller()
  public async createLevel({ id, guildId }: CreateLevelOptions) {
    const guildCheck = await this.guildCheck(guildId);

    if (!guildCheck) return; // if not found or see in guildCheck method

    const { globalLevel, localLevel } = await this.getLevelId(id, guildId);

    // Create on Global/LocalLevel table new user if not found
    if (!globalLevel && guildCheck.globalLevel) await this.createGlobalLevel(Transforms.stringToBigInt(id));
    if (!localLevel && guildCheck.levelModule) await this.createLocalLevel(Transforms.stringToBigInt(id), Transforms.stringToBigInt(guildId));

    // Or Ignored both tables
  }

  /**
   * Updates the level information for a user, either globally or locally within a guild.
   * 
   * @param options - The options for updating the level.
   * @param options.id - The unique identifier of the user.
   * @param options.guildId - The unique identifier of the guild.
   * @param options.data - The data to update in the level record.
   * @param options.type - The type of level update, either "global" or "local".
   * @returns A promise that resolves when the update operation is complete.
   */
  public async updateLevel({ id, guildId, data, type }: UpdateGlobalLevelOptions): Promise<void>
  public async updateLevel({ id, guildId, data, type }: UpdateLocalLevelOptions): Promise<void>;
  @Decorators.logCaller()
  public async updateLevel({ id, guildId, data, type }: UpdateLevelOptions): Promise<void> {
    const guildCheck = await this.guildCheck(guildId);

    if (!guildCheck) return;

    const { globalLevel, localLevel } = await this.getLevelId(id, guildId);

    const tasks: unknown[] = [];

    if (guildCheck.globalLevel && type === "global") {
      if (globalLevel) {
        tasks.push(this.updateLevelLogic(id, type, data));
      } else {
        tasks.push(this.createGlobalLevel(Transforms.stringToBigInt(id)));
      }
    }

    if (guildCheck.levelModule && type === "local") {
      if (localLevel) {
        tasks.push(this.updateLevelLogic(localLevel.id.toString(), type, data));
      } else {
        tasks.push(this.createLocalLevel(Transforms.stringToBigInt(id), Transforms.stringToBigInt(guildId)));
      }
    }

    await Promise.all(tasks);
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
  @Decorators.logCaller()
  private async updateLevelLogic(id: string, type: UpdateLevelType, data: UpdateLevelLogicData): Promise<void> {
    if (!id || id.length === 0) throw emiliaError("[LevelManager.updateLevel(logic)]: Id is required!", "TypeError");
    if (!data || Object.keys(data).length === 0) throw emiliaError("[LevelManager.updateLevel(logic)]: Data is required!", "TypeError");

    // There - is no need to update. Or DRY). I know about any. This any need there)
    const updater = (type === "global" ? db.globalLevel : db.localLevel) as any;

    await updater.update({
      where: { id: Transforms.stringToBigInt(id) },
      data,
      select: { id: true }
    });
  }


  /**
   * Deletes the global level information for a user.
   * 
   * @param id - The unique identifier of the user as a string.
   * @throws {TypeError} If the id is empty or not provided.
   * @returns A promise that resolves when the delete operation is complete.
   */
  @Decorators.logCaller()
  public async deleteGlobalLevel(id: string) {
    if (!id || id.length === 0) throw emiliaError("[LevelManager.deleteGlobalLevel]: Id is required!", "TypeError");

    await db.globalLevel.delete({ where: { id: Transforms.stringToBigInt(id) } });
  }


  /**
   * Deletes the local level information for a user in a specific guild.
   * 
   * @param id - The unique identifier of the user as a string.
   * @param guildId - The unique identifier of the guild as a string.
   * @throws {TypeError} If the id or guildId is empty or not provided.
   * @returns A promise that resolves when the delete operation is complete.
   */
  @Decorators.logCaller()
  public async deleteLocalLevel(id: string, guildId: string) {
    if (!id || id.length === 0) throw emiliaError("[LevelManager.deleteLocalLevel]: Id is required!", "TypeError");
    if (!guildId || guildId.length === 0) throw emiliaError("[LevelManager.deleteLocalLevel]: GuildId is required!", "TypeError");

    const { localLevel } = await this.getLevelId(id, guildId);

    if (!localLevel) return;

    await db.localLevel.delete({ where: { id: localLevel.id } });
  }

  /**
   * Retrieves the global and local level information for a user in a specific guild.
   * 
   * @param id - The unique identifier of the user as a string.
   * @param guildId - The unique identifier of the guild as a string.
   * @returns A Promise that resolves to an object containing:
   *          - globalLevel: The global level information for the user (null if not found).
   *          - localLevel: The local level information for the user in the specified guild (null if not found).
   */
  @Decorators.logCaller()
  private async getLevelId(id: string, guildId: string) {
    const bigId = Transforms.stringToBigInt(id); // transform string id to bigint
    const bigGuildId = Transforms.stringToBigInt(guildId); // transform string id to bigint

    const select = { id: true };
    const AND: ({ userId: bigint } | { guildId: bigint })[] = [{ userId: bigId }, { guildId: bigGuildId }];

    const [globalLevel, localLevel] = await Promise.all([
      db.globalLevel.findFirst({ where: { id: bigId }, select }),
      db.localLevel.findFirst({ where: { AND }, select })
    ]);

    return { globalLevel, localLevel };
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
  @Decorators.logCaller()
  private async guildCheck(id: string) {
    const guild = await db.guild.findUnique({ where: { id: Transforms.stringToBigInt(id) }, select: { globalLevel: true, levelModule: true, addInBD: true } });

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
  @Decorators.logCaller()
  private async createGlobalLevel(id: bigint) {

    await db.globalLevel.create({
      data: {
        id,
        nextXp: this.getNextXpTime,
        user: { connect: { id } }
      },
      select: { id: true } // One information element
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
  @Decorators.logCaller()
  private async createLocalLevel(id: bigint, guildId: bigint) {
    if (!id) throw emiliaError("[LevelManager.createLevel(local)]: Id is required!");
    if (!guildId) throw emiliaError("[LevelManager.createLevel(local)]: GuildId is required!");

    await db.localLevel.create({
      data: {
        userId: id,
        guildId,
        level: 0,
        xp: 0,
        maxXp: 150,
        nextXp: this.getNextXpTime,
        User: { connect: { id } },
        Guild: { connect: { id: guildId } }
      },
      select: { id: true } // One information element
    });
  }
}