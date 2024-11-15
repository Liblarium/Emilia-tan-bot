import { displayColor, time } from "@util/s";
import type { APIEmbed, GuildMember } from "discord.js";

/**
 * Returns an APIEmbed with the current time at the host.
 * @param {GuildMember} member - The member to get the display color from.
 * @returns {APIEmbed}
 */
export function getTime(member: GuildMember): APIEmbed {
  return {
    title: "Время",
    description: `Сейчас у хоста: **${time()}**`,
    timestamp: new Date().toISOString(),
    color: displayColor(member.displayColor, "#48dfbf"),
    footer: {
      text: "\u200b",
      icon_url: member.displayAvatarURL({ forceStatic: false }),
    }
  };
}

