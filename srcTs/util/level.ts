import { db } from "@client";
import { Log } from "@log";
import type { LevelOptions, LevelValues } from "@type/util/level";
import { logCaller } from "@util/decorators";
import { EmiliaError, random, stringToBigInt } from "@util/s";
import { ChannelType, type Message } from "discord.js";

let errs = 0;
export class Levels {
  private readonly message: Message;
  constructor(mess: Message) {
    this.message = mess;
    this._build();
  }

  /**
   * Next XP time in milliseconds.
   * @returns {bigint} The next XP time
   * @private
   */
  private get nextXp(): bigint {
    return stringToBigInt((Date.now() + (30 * 1000)).toString());
  }
  /**
   * Initialization of the user in the database, if the user is not in the database.
   * @private
   */
  @logCaller
  private async _build() {
    const message = this.message;

    if (
      message.channel.type === ChannelType.DM ||
      !message.member ||
      !message.guild ||
      !message.guildId ||
      !["451103537527783455", "334418584774246401"].includes(message.guildId) ||
      message?.author?.bot === true
    )
      return;
    const guildId = stringToBigInt(message.guildId);
    const userId = stringToBigInt(message.member.user.id);
    const username = message.member.user.username;

    const guildDB = await db.guild.findFirst({
      where: { id: guildId },
      select: { addInBD: true, levelModule: true },
    });

    if (!guildDB) return; //пока без добавления гильдии отдельно //TODO: Подумать над этим

    const user = await db.user.findFirst({
      where: { id: userId },
      select: {
        globalLevel: {
          select: {
            xp: true,
            level: true,
            maxXp: true,
            nextXp: true,
          },
        },
        LocalLevel: {
          where: {
            AND: [
              { userId: { equals: userId } },
              { guildId: { equals: guildId } },
            ],
          },
          select: {
            id: true,
            xp: true,
            level: true,
            maxXp: true,
            nextXp: true,
          },
        },
      },
    });

    if (!user || !user.globalLevel) {
      if (guildDB.addInBD !== true) return; //addInBD: boolean | null

      const levelModule = guildDB.levelModule;

      errs++;
      return this.addUser(
        {
          userId,
          username,
          guildId: levelModule === true ? guildId : undefined,
          localLevelId: levelModule === true ? (user?.LocalLevel[0].id ?? 0n) : 0n,
        }
      );
    }

    errs = 0;

    const localLevel = user.LocalLevel;
    this.level({ args: user.globalLevel, userId, dbType: "global", localLevelId: localLevel.length === 0 ? 0n : localLevel[0].id ?? 0n });
    const local_level = user?.LocalLevel;

    if (
      guildDB.levelModule &&
      local_level !== undefined &&
      local_level.length > 0
    )
      return this.level({
        args: local_level[0],
        userId,
        guildId,
        dbType: "local",
        localLevelId: local_level[0].id ?? 0n,
      });

    return this.addUser({ userId, username, guildId, localLevelId: local_level?.length === 0 ? 0n : local_level[0].id ?? 0n });
  }

  @logCaller
  private async level({
    args,
    dbType,
    userId,
    guildId,
    localLevelId = 0n
  }: LevelOptions) {
    if (
      !args ||
      typeof args.nextXp !== "bigint" ||
      typeof args.maxXp !== "number" ||
      typeof args.xp !== "number" ||
      typeof args.level !== "number"
    )
      throw new Log({
        text: `Похоже - в Levels.level не были переданы нужные аргументы. (${args}, ${dbType}, ${userId})`,
        type: "error",
        categories: ["global", "pg"],
      });

    if (args.nextXp > stringToBigInt(Date.now().toString())) return;

    const addExp = random(1, 15); //TODO:позже добавлю связку с БД для local level
    let newXp = args.xp + addExp;
    let newLvl = false;

    if (newXp > args.maxXp) {
      newXp -= args.maxXp;
      newLvl = true;
    }
    let result: { xp: number; level: number; maxXp: number } = { xp: 0, level: 0, maxXp: 0 };
    const values: LevelValues = { xp: newXp, nextXp: this.nextXp };

    if (newLvl === true) {
      values.level = { increment: 1 };
      values.maxXp = ((args.maxXp ?? 0) + 0.5) * (args.level + 2);
    }

    if (dbType === "global") {
      result = await db.globalLevel.update({ where: { id: userId }, data: { ...values }, select: { xp: true, level: true, maxXp: true } });
    }

    if (dbType === "local") {
      if (!guildId) return new Log({ text: `Похоже - в Levels.level не был передан guildId ${guildId}`, type: "error", categories: ["global", "pg"] });

      return await db.localLevel.update({ where: { id: localLevelId }, data: { ...values }, select: { xp: true, level: true, maxXp: true } });
    }

    return result;
  }

  @logCaller
  private async addUser({ userId, username, guildId, localLevelId }: { userId: bigint, username: string, guildId?: bigint, localLevelId?: bigint }): Promise<unknown> {
    const dostup = await db.dostup.findFirst({ where: { id: userId }, select: { id: true } });

    if (!dostup) await db.dostup.create({ data: { id: userId }, select: { id: true } });

    //const user = await db.user.findFirst({ where: { id: userId }, select: { id: true } });

    await db.$transaction([
      db.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          username
        },
        select: { id: true }
      }),
      db.globalLevel.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          userId,
          nextXp: this.nextXp
        },
        select: { id: true }
      })
    ]);

    if (guildId !== undefined) {
      if (localLevelId === undefined) throw new EmiliaError("Where is localLevelId?");

      const localLevel = await db.localLevel.findFirst({
        where: { id: localLevelId },
        select: { id: true },
      });

      if (!localLevel) await db.localLevel.create({
        data: {
          xp: 0, level: 0, maxXp: 150, nextXp: this.nextXp, user: { connect: { id: userId } }, guild: { connect: { id: guildId } }
        },
        select: { id: true },
      });
    }

    return this._build();
  }
}
