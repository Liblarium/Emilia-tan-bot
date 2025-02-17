import { Decorators, emiliaError, Transforms } from "@utils";
import { Message } from "discord.js";
import { db } from "@client";
import { CreateLevelOptions } from "@type/database/levelManage";

export class LevelManage {
  private readonly message: Message;

  constructor(message: Message) {
    this.message = message;
  }

  private get getNextXpTime(): bigint {
    return Transforms.stringToBigInt((Date.now() + (30 * 1000)).toString());
  }

  @Decorators.logCaller()
  public async createLevel({ id, username, guildId }: CreateLevelOptions) {
    const bigId = Transforms.stringToBigInt(id); // transform string id to bigint
    const bigGuildId = Transforms.stringToBigInt(guildId ?? "0"); // transform string id to bigint
    const findGlobalLevel = await db.globalLevel.findFirst({ where: { id: bigId }, select: { id: true } });
    const findLocalLevel = bigGuildId === 0n ? null : await db.localLevel.findFirst({ where: { AND: [{ userId: bigId }, { guildId: bigGuildId }] }, select: { id: true } });
    let isGlobalLevel: boolean = false;
    let isLocalLevel: boolean = false;

    if (findGlobalLevel?.id === bigId) isGlobalLevel = true;
    if (findLocalLevel?.id === bigId) isLocalLevel = true;

    if (isGlobalLevel) this.createGlobalLevel(bigId, username);
  }

  @Decorators.logCaller()
  private async createGlobalLevel(id: bigint, username: string) {
    if (!id) throw emiliaError("[LevelManager.createLevel(global)]: Id is required!");

    const where = { id };
    const update = {};
    const select = { id: true };

    await db.$transaction([
      db.user.upsert({
        where,
        update,
        create: {
          id,
          username
        },
        select
      }),
      db.globalLevel.upsert({
        where,
        update,
        create: {
          id,
          userId: id,
          nextXp: this.getNextXpTime
        },
        select
      })
    ]);
  }

  @Decorators.logCaller()
  private createLocalLevel(id: bigint, guildId: bigint) {
    // TODO: Release this method
  }
}
