import { db } from "@client";
import type { GuildPrefix } from "@type/command";
import { displayColor, hexToDecimal, parseJsonValue, prefix, stringToBigInt } from "@util/s";
import type { APIEmbed } from "discord.js";

export async function getOrEditPrefix({
  guildId,
  isOwner,
  newPrefix,
  color
}: { guildId: bigint | string; newPrefix: string | null; color: string | number; isOwner: boolean }): Promise<APIEmbed> {
  if (typeof guildId === "string") guildId = stringToBigInt(guildId);

  color = displayColor(color, "#48dfbf");
  const guild = await db.guild.findFirst({
    where: { id: guildId },
    select: { prefix: true },
  });
  const guildPrefix: GuildPrefix =
    guild === null
      ? { default: prefix, now: prefix }
      : parseJsonValue<GuildPrefix>(guild.prefix);

  if (isOwner && newPrefix) {
    if (guildPrefix.now === newPrefix) return {
      title: "Изменение префикса",
      description: "Данный префикс уже стоит!",
      color: hexToDecimal("#ff2500")
    };

    const updatePrefix = await db.guild.update({
      where: { id: guildId },
      data: { prefix: { now: newPrefix, default: guildPrefix.default } },
      select: { prefix: true },
    });
    const newPrefixValue = parseJsonValue<GuildPrefix>(updatePrefix.prefix).now;

    return {
      title: "Изменение префикса",
      description: `Префикс изменен на: **${newPrefixValue}**!`,
      color
    };
  }

  return {
    title: "Префикс бота",
    description: `Установленный на сервер префикс: **${guildPrefix.now}**.\nСтандартный префикс: **${prefix}**`,
    color
  };
}
