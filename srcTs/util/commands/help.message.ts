import { db } from "@client";
import type { GuildPrefix } from "@type/command";
import { helpList, helpName } from "@util/help.list";
import { displayColor, hexToDecimal, parseJsonValue, prefix, stringToBigInt } from "@util/s";
import type { APIEmbed, EmbedAuthorData } from "discord.js";

export async function getHelpMessage({
  guildId,
  memberColor,
  commandName,
  author
}: {
  guildId: string | bigint;
  memberColor: string | number;
  commandName?: string | null;
  author: EmbedAuthorData;
}): Promise<APIEmbed> {
  if (typeof guildId === "string") guildId = stringToBigInt(guildId);

  const guildConfig = await db.guild.findFirst({
    where: { id: guildId },
    select: { prefix: true },
  });

  const timestamp = new Date().toISOString();
  const guildPrefix: GuildPrefix =
    guildConfig === null
      ? { default: prefix, now: prefix }
      : parseJsonValue<GuildPrefix>(guildConfig.prefix);

  if (commandName) {
    const command = helpList.get(commandName);

    const result: APIEmbed = {
      author,
      color: command ? displayColor(memberColor, "#48dfbf") : hexToDecimal("#ff2500"),
      description: command
        ? `Имя команды: **${command.name}**\nОписание: ${command.text}${command.aliases.length > 0 ? `\nАльтернативные названия для вызова этой команды: ${command.aliases.map((i) => `**${i}**`).join(", ")}` : ""}`
        : `К сожалению - **${commandName}** не был(а) найдена`,
      footer: command ? undefined : {
        text: `Введите ${guildPrefix.now}help для просмотра списка команд)`,
      },
      timestamp
    };

    return result;
  }

  return {
    author,
    color: displayColor(memberColor, "#48dfbf"),
    description: `Список доступных команд: \n${helpName.map((i) => `${guildPrefix.now}**${i}**`).join(", ")}`,
    timestamp
  };
}
