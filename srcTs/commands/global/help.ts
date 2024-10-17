import { BaseCommand } from "@base/command";
import { db } from "@database";
import { guild } from "@schema/guild";
import { helpList, helpName } from "@util/help.list";
import { prefix } from "@util/s";
import type { Message } from "discord.js";
import { eq } from "drizzle-orm";

export default class Help extends BaseCommand {
  constructor() {
    super({
      name: "help",
      option: {
        type: "command",
        aliases: ["помощь", "command", "команды", "хелп", "commands"],
        delete: true,
      },
    });
  }

  async execute(message: Message, args: string[], commandName: string) {
    if (!message.member || !message.guild) return;

    const guildDB = await db.query.guild.findFirst({ where: eq(guild.id, BigInt(message.guild.id)), columns: { prefix: true } });
    const pref = guildDB !== undefined ? (guildDB.prefix)?.now ?? prefix : prefix;
    const helpCommandName = args[0];
    const color =
      message.member.displayColor === 0
        ? 0x48_df_bf
        : message.member.displayColor;
    const icon_url = message.member.displayAvatarURL({ forceStatic: false });
    const timestamp = new Date().toISOString();

    if (!helpCommandName)
      return message.channel.send({
        embeds: [
          {
            title: "Список команд",
            description: helpName
              .map((i) => `**${i}** - ${helpList.get(i)?.text ?? "[Ашибка]"}`)
              .join(",\n"),
            color,
            timestamp,
            footer: {
              text: `Для информации о команде - введите ${pref}${commandName} имя-команды. Вместо ${commandName} - вы можете использовать его альтернативные названия`,
              icon_url,
            },
          },
        ],
      });

    if (!(helpCommandName in helpList)) {
      const truncatedCommandName = helpCommandName.length >= 501 ? `${helpCommandName.slice(0, 500)}...` : helpCommandName;
      const description = `Хочу вас огорчить - в списке команд такой команды (${truncatedCommandName}) нет.`;

      return message.channel.send({
        embeds: [
          {
            title: "Ошибка",
            description,
            color: 0xff_25_00,
            timestamp,
            footer: {
              text: `Список доступных команд можно глянуть в ${pref}${commandName}. Без дополнительных аргументов`,
              icon_url,
            },
          },
        ],
      });
    }
    message.channel.send({
      embeds: [
        {
          title: helpCommandName,
          description: helpList.get(helpCommandName)?.text,
          color,
          timestamp,
          footer: {
            text: "\u200b",
            icon_url,
          },
        },
      ],
    }).catch((e: unknown) => { console.error(e); });
  }
}
