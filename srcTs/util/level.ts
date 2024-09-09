import { db } from "@database";
import { Log } from "@log";
import { guild } from "@schema/guild";
import { globalLevel } from "@schema/level.global";
import { localLevel } from "@schema/level.local";
import { users } from "@schema/user";
import type { LevelOptions, LevelReturning, LevelValues, UserValue } from "@type/util/level";
import { AddInDB } from "@util/addInDB";
import { random } from "@util/s";
import { ChannelType, type Message } from "discord.js";
import { and, eq, sql } from "drizzle-orm";

let errs = 0;

export class Levels {
  private readonly message: Message;
  constructor(mess: Message) {
    this.message = mess;
    this._build();
  }
  private async _build() {
    const message = this.message;

    if (
      message.channel.type === ChannelType.DM
      || !message.member
      || !message.guild
      || !message.guildId
      || !["451103537527783455", "334418584774246401"].includes(message.guildId)
      || message?.author?.bot === true
    ) return;

    const guildId = BigInt(message.guildId);
    const userId = BigInt(message.member.user.id);

    const guilddb = await db.query.guild.findFirst({
      where: eq(guild.id, guildId),
      columns: { addInBD: true, levelModule: true },
    });

    if (!guilddb) return; //пока без добавления гильдии отдельно
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        global_level: {
          columns: {
            xp: true,
            level: true,
            maxXp: true,
            nextXp: true,
          },
        },
        local_level: {
          where: eq(localLevel.guildId, guildId),
          columns: {
            xp: true,
            level: true,
            maxXp: true,
            nextXp: true,
          },
        },
      },
      columns: {},
    });

    if (!user) {
      if (guilddb.addInBD !== true) return; //addInBD: boolean | null

      errs++;
      this.addUser(userId, guilddb.levelModule === true ? guildId : undefined);
      this._build(); //уходит в начало
    }

    errs = 0;
    const nowMs = BigInt(Date.now());

    this.level({ args: user?.global_level, nowMs, userId, dbType: "global" });
    const local_level = user?.local_level;

    if (guild.levelModule && (local_level !== undefined && local_level.length > 0)) this.level({ args: local_level[0], nowMs, userId, guildId, dbType: "local" });
    else {
      this.addUser(userId, guildId);
      this._build();
    }
  }

  private async level({ args, nowMs, dbType, userId, guildId }: LevelOptions): Promise<LevelReturning | Log | void> {
    if (!args || typeof args.nextXp !== "bigint" || typeof args.maxXp !== "number" || typeof args.xp !== "number" || typeof args.level !== "number") {
      console.log("args: ", args, "nowMs: ", nowMs, "dbType: ", dbType, "userId: ", userId, "guildId: ", guildId);
      return new Log({ text: `Похоже - в Levels.level не были переданы нужные аргументы. (${args}, ${nowMs}, ${dbType}, ${userId})`, type: "error", categories: ["global", "pg"] });
    }

    if (args.nextXp > nowMs) return console.log(`Пока рано (${Number((args.nextXp - nowMs) / BigInt(1000))}s)`);

    const addExp = random(1, 15); //позже добавлю связку с БД для local level
    let newXp = args.xp + addExp;
    let newLvl = false;

    if (newXp > args.maxXp) {
      newXp -= args.maxXp;
      newLvl = true;
    }

    const updTable = dbType === "global" ? globalLevel : localLevel;
    const values: LevelValues = { xp: newXp, nextXp: nowMs + BigInt(30 * 1000) };
    let result: LevelReturning = [];

    if (newLvl === true) {
      values.level = sql`${updTable.level} + 1`;
      values.maxXp = ((args.maxXp ?? 0) + 0.5) * (args.level + 2);
    }

    if (dbType === "global") {
      result = await db
        .update(globalLevel).set(values)
        .where(eq(globalLevel.id, userId))
        .returning({ insertedId: globalLevel.id });
    }
    if (dbType === "local") {
      if (!guildId) return new Log({ text: `Похоже - в Levels.level не был передан guildId ${guildId}`, type: "error", categories: ["global", "pg"] });

      return await db
        .update(localLevel).set(values)
        .where(and(eq(localLevel.userId, userId), eq(localLevel.guildId, guildId)))
        .returning({ insertedId: localLevel.userId });
    }

    return result;
  }

  private async addUser(userId: bigint, guildId?: bigint) {
    new AddInDB(this.message);

    await db.transaction(async (tx) => {
      const globalLevelRes = await tx
        .insert(globalLevel)
        .values({ id: userId })
        .returning({ insertedId: globalLevel.id })
        .onConflictDoNothing();

      if (guildId !== undefined) {
        await tx
          .insert(localLevel)
          .values({
            guildId,
            userId,
          })
          .returning({ insertedId: localLevel.id });
      }

      return globalLevelRes.length > 0;
    });
  }
}
