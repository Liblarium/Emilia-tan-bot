import { db } from "@client";
import { hexToDecimal, stringToBigInt } from "@util/s";
import type { APIEmbed } from "discord.js";

/**
 * @function getXp
 * @description Returns a Discord.js Embed object with the user's current level.
 * @param {{ id: bigint | string, guildId: bigint | string, color: number | string, isYou: boolean }} options
 * @param {bigint | string} options.id The user's ID.
 * @param {bigint | string} options.guildId The guild ID to get the local level from.
 * @param {number | string} options.color The color of the embed.
 * @param {boolean} options.isYou Whether the user is author of the message or other user.
 * @returns {Promise<APIEmbed>}
 * @example
 * const embed = await getXp({
 *   id: "1234567890",
 *   guildId: "1234567890",
 *   color: "#00ff00",
 *   isYou: yourId === sendedId
 * });
 * await message.channel.send({ embeds: [embed] });
 */
export async function getXp({ id, guildId, color, isYou }: {
  id: bigint | string,
  guildId: bigint | string,
  color: number | string,
  isYou: boolean
}): Promise<APIEmbed> {
  if (typeof color === "string") color = hexToDecimal(color);
  if (typeof id === "string") id = stringToBigInt(id);
  if (typeof guildId === "string") guildId = stringToBigInt(guildId);

  const errColor = hexToDecimal("#ff2500");
  const user = await db.user.findFirst({
    where: { id },
    select: {
      globalLevel: { select: { level: true, maxXp: true, xp: true } },
      LocalLevel: { where: { userId: id, guildId }, select: { level: true, maxXp: true, xp: true } }
    },
  });

  if (!user) return {
    title: "Текущий уровень",
    description: isYou ? "Вы не находитесь в БД. Попробуйте отправить любое сообщение (без команд) в чат или попробуйте ещё раз." : "Пользователь не найден в БД.",
    color: errColor,
    footer: {
      text: "Возможно, на этом сервере не включена запись в БД."
    }
  };

  return {
    title: "Текущий уровень",
    description: `Глобальный уровень: **${user.globalLevel?.level ?? "[Нет данных]"}** (${user.globalLevel?.xp ?? "[Нет данных]"}/${user.globalLevel?.maxXp ?? "[Нет данных]"})${user.LocalLevel.length > 0 ? `\nЛокальный уровень: **${user.LocalLevel[0].level}** (${user.LocalLevel[0].xp}/${user.LocalLevel[0].maxXp})` : ""}`,
    color
  };
}