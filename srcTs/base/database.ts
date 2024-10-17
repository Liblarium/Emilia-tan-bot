import { db } from "@database";
import { Log } from "@log";
import { dostup } from "@schema/dostup";
import { globalLevel } from "@schema/level.global";
import { localLevel } from "@schema/level.local";
import { users } from "@schema/user";
import type { FindOrCreateOptionalOptions } from "@type/base/database";
import { EmiliaError } from "@util/s";
import { and, eq } from "drizzle-orm";

/**
 * Abstract class representing a Database.
 */
export abstract class Database {
  /**
   * The database instance.
   * @protected
   */
  protected db: typeof db = db;

  /**
   * A shortcut to the baka table.
   * @returns The baka table.
   */
  protected get getBakaTable(): typeof this.db.query.baka {
    return this.db.query.baka;
  }

  /**
   * A shortcut to the clan table.
   * @returns The clan table.
   */
  protected get getClanTable(): typeof this.db.query.clan {
    return this.db.query.clan;
  }

  /**
   * A shortcut to the clan member table.
   * @returns The clan member table.
   */
  protected get getClanMemberTable(): typeof this.db.query.clanMember {
    return this.db.query.clanMember;
  }

  /**
   * A shortcut to the clan role table.
   * @returns The clan role table.
   */
  protected get getClanRoleTable(): typeof this.db.query.clanRole {
    return this.db.query.clanRole;
  }

  /**
   * A shortcut to the dostup table.
   * @returns The dostup table.
   */
  protected get getDostupTable(): typeof this.db.query.dostup {
    return this.db.query.dostup;
  }

  /**
   * A shortcut to the guild table.
   * @returns The guild table.
   */
  protected get getGuildTable(): typeof this.db.query.guild {
    return this.db.query.guild;
  }

  /**
   * A shortcut to the global level table.
   * @returns The global level table.
   */
  protected get getGlobalLevelTable(): typeof this.db.query.globalLevel {
    return this.db.query.globalLevel;
  }

  /**
   * A shortcut to the local level table.
   * @returns The local level table.
   */
  protected get getLocalLevelTable(): typeof this.db.query.localLevel {
    return this.db.query.localLevel;
  }

  /**
   * A shortcut to the private voice table.
   * @returns The private voice table.
   */
  protected get getPrivateVoiceTable(): typeof this.db.query.privateVoice {
    return this.db.query.privateVoice;
  }

  /**
   * A shortcut to the test table.
   * @returns The test table.
   */
  protected get getTestTable(): typeof this.db.query.test {
    return this.db.query.test;
  }

  /**
   * A shortcut to the users table.
   * @returns The users table.
   */
  protected get getUsersTable(): typeof this.db.query.users {
    return this.db.query.users;
  }

  /**
   * Find or create a user in the database.
   * @param id The user ID to find or create.
   * @param username The username of the user.
   * @param options Optional options to include in the query or log.
   * @returns The found or created user.
   */
  protected async findOrCreateUser(
    id: bigint,
    username: string,
    {
      _with,
      columns,
      log = { text: "", type: "info", categories: ["global", "database"] },
    }: FindOrCreateOptionalOptions,
  ) {
    if (!id || typeof id !== "bigint")
      throw new EmiliaError(
        "[Database.findOrCreateUser]: id must be a bigint and not empty!",
      );
    if (!username || typeof username !== "string")
      throw new EmiliaError(
        "[Database.findOrCreateUser]: username must be a string and not empty!",
      );

    const user = await this.getUsersTable.findFirst({
      where: eq(users.id, id),
      with: _with,
      columns,
    });

    if (!user) {
      await this.db.insert(users).values({ id, username }).returning();

      if (log) new Log(log);

      this.findOrCreateUser(id, username, { _with, columns });
    } else return user;
  }

  /**
   * Find or create a dostup entry in the database.
   * @param id The Discord user ID to find or create.
   * @param args Optional arguments to set the dostup properties if it does not exist.
   * @param options Optional options to include in the query or log.
   * @returns The found or created dostup entry.
   */
  protected async findOrCreateDostup(
    id: bigint,
    args: {
      base?: string;
      reader?: string;
      additionalAccess?: string[];
      maxRank?: number;
    } = { base: "Гость", reader: "F", additionalAccess: [], maxRank: 9 },
    {
      _with,
      columns,
      log = { text: "", type: "info", categories: ["global", "database"] },
    }: FindOrCreateOptionalOptions,
  ) {
    if (!id || typeof id !== "bigint")
      throw new EmiliaError(
        "[Database.findOrCreateDostup]: id must be a bigint and not empty!",
      );

    const dostupFind = await this.getDostupTable.findFirst({
      where: eq(dostup.id, id),
      with: _with,
    });

    if (!dostupFind) {
      await this.db
        .insert(dostup)
        .values({ id, ...args })
        .returning();

      if (log) new Log(log);

      this.findOrCreateDostup(id, args, { _with, columns });
    } else return dostupFind;
  }

  /**
   * Find or create a global level entry in the database.
   * @param id The Discord user ID to find or create.
   * @param args The arguments to set the global level entry to if it does not exist.
   * @param options Optional options to include in the query or log.
   * @returns The found or created global level entry.
   */
  protected async findOrCreateGlobalLevel(
    id: bigint,
    args: { xp: number; level: number; maxXp: number },
    {
      _with,
      columns,
      log = { text: "", type: "info", categories: ["global", "database"] },
    }: FindOrCreateOptionalOptions,
  ) {
    if (!id || typeof id !== "bigint")
      throw new EmiliaError(
        "[Database.findOrCreateGlobalLevel]: id must be a bigint and not empty!",
      );
    if (!args || typeof args !== "object" || Object.entries(args).length === 0)
      throw new EmiliaError(
        "[Database.findOrCreateGlobalLevel]: args must be an object and not empty! (xp, level, maxXp)",
      );

    const globalLevelFind = await this.getGlobalLevelTable.findFirst({
      where: eq(globalLevel.id, id),
      with: _with,
      columns,
    });

    if (!globalLevelFind) {
      await this.db
        .insert(globalLevel)
        .values({ id, ...args })
        .returning();

      if (log) new Log(log);

      this.findOrCreateGlobalLevel(id, args, { _with, columns });
    } else return globalLevelFind;
  }

  /**
   * Find or create a local level entry in the database.
   * @param id The Discord user ID to find or create.
   * @param guildId The guild ID to find or create.
   * @param value The value to set the local level entry to if it does not exist.
   * @param options Optional options to include in the query or log.
   * @returns The found or created local level entry.
   */
  protected async findOrCreateLocalLevel(
    id: bigint,
    guildId: bigint,
    value: { xp: number; level: number; maxXp: number },
    {
      _with,
      columns,
      log = { text: "", type: "info", categories: ["global", "database"] },
    }: FindOrCreateOptionalOptions,
  ) {
    if (!id || typeof id !== "bigint")
      throw new EmiliaError(
        "[Database.findOrCreateLocalLevel]: id must be a bigint and not empty!",
      );
    if (!guildId || typeof guildId !== "bigint")
      throw new EmiliaError(
        "[Database.findOrCreateLocalLevel]: guildId must be a bigint and not empty!",
      );
    if (
      !value ||
      typeof value !== "object" ||
      Object.entries(value).length === 0
    )
      throw new EmiliaError(
        "[Database.findOrCreateLocalLevel]: value must be an object and not empty! (xp, level, maxXp)",
      );

    const localLevelFind = await this.getLocalLevelTable.findFirst({
      where: and(eq(localLevel.userId, id), eq(localLevel.guildId, guildId)),
      with: _with,
      columns,
    });

    if (!localLevelFind) {
      await this.db
        .insert(localLevel)
        .values({ userId: id, guildId, ...value })
        .returning();

      if (log) new Log(log);

      this.findOrCreateLocalLevel(id, guildId, value, { _with, columns });
    } else return localLevelFind;
  }
}
