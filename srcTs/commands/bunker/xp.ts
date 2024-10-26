import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { stringToBigInt } from "@util/s";
import type { Message } from "discord.js";

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
    if (!message.guildId || !message.guild || !message.member || message.channel.isDMBased()) return;

    const db = client.db;
    const mbr = message.mentions.members?.first() || message.guild.members.cache.get(args[0]);
    const member = mbr === undefined ? message.member : mbr;
    const guildId = stringToBigInt(message.guildId);
    const userId = stringToBigInt(member.user.id);
    const guildDB = await db.guild.findFirst({ where: { id: guildId }, select: { levelModule: true } });

    if (!guildDB) return message.channel.send({ content: "Возможно - данный сервер не находится в БД." });

    const local_level = guildDB === undefined ? false : typeof guildDB.levelModule === "boolean" ? guildDB.levelModule : false;
    const user = await db.user.findFirst({ where: { id: userId }, select: { globalLevel: { select: { xp: true, level: true, maxXp: true } }, LocalLevel: { where: { guildId }, select: { xp: true, level: true, maxXp: true } } } });

    if (!user) return message.channel.send({ content: "Возможно - указанного пользователя нет в БД)" });
    if (!user.globalLevel) return message.channel.send({ content: "Возможно - у указанного пользователя нет уровней в БД)" });

    const gRank = user.globalLevel;
    const lRank = user.LocalLevel[0];

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
