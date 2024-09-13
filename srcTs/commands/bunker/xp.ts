import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { db } from "@database";
import { guild } from "@schema/guild";
import { users } from "@schema/user";
import type { Message } from "discord.js";
import { eq } from "drizzle-orm";

export default class Xp extends BaseCommand {
  constructor() {
    super({
      name: "xp",
      option: {
        type: "command",
        delete: true
      }
    });
  }

  async execute(message: Message, args: string[], commandName: string, client: EmiliaClient) {
    if (!message.guildId || !message.guild || !message.member) return;

    const mbr = message.mentions.members?.first() || message.guild.members.cache.get(args[0]);
    const member = mbr === undefined ? message.member : mbr;
    const guildId = BigInt(message.guildId);
    const userId = BigInt(member.user.id);
    const guilddb = await db.query.guild.findFirst({ where: eq(guild.id, guildId), columns: { levelModule: true } });
    const local_level = guilddb === undefined ? false : typeof guilddb.levelModule === "boolean" ? guilddb.levelModule : false;
    const user = await db.query.users.findFirst({ where: eq(users.id, userId), columns: {}, with: { global_level: { columns: { xp: true, level: true, maxXp: true } }, local_level: { where: eq(guild.id, guildId), columns: { xp: true, level: true, maxXp: true } } } });

    if (!user) return message.channel.send({ content: "Возможно - указанного пользователя нет в БД)" });

    const gRank = user.global_level;
    const lRank = user.local_level[0];

    let description = `Уровень: **${gRank.level}**\nОпыт: **${gRank.xp}**/**${gRank.maxXp}**`;
    if (local_level) description += `\n\nЛокальный уровень: **${lRank.level}**\nОпыт: **${lRank.xp}**/**${lRank.maxXp}**`;

    message.channel.send({
      embeds: [{
        title: `${member.displayName}`,
        description,
        footer: { text: `Глобальный опыт накопляется раз в 30 секунд.${local_level ? " Локальный (по дефолту) - тоже. Если включен на сервере" : ""}` }
      }]
    });
  }
}
