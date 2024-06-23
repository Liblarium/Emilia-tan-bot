import { helpList, helpName } from "../../util/help.list";
import { BaseCommand } from "../../base/command";
import { EmiliaClient } from "../../client";
import { Database } from "../../database";
import { Message } from "discord.js";
import { prefix } from "../../utils";

export default class Help extends BaseCommand {
  constructor() {
    super({
      name: `help`,
      option: {
        type: `command`,
        aliases: [`помощь`, `command`, `команды`, `хелп`, `commands`],
        delete: true
      }
    });
  }

  async execute(message: Message, args: any[], commandName: string, client: EmiliaClient) {
    if (!message.member || !message.guild) return;

    const db = new Database();
    const guilddb = await db.findOneBy(`guilds`, { id: message.guild.id });
    const pref = guilddb.error != null ? prefix : `${guilddb.res?.prefix?.now}`;
    const helpCommandName = args[0];
    const color = message.member.displayColor == 0 ? parseInt(`48dfbf`, 16) : message.member.displayColor;
    const icon_url = message.member.displayAvatarURL({ forceStatic: false });
    const timestamp = new Date().toISOString();

    if (!helpCommandName) return message.channel.send({
      embeds: [{
        title: `Список команд`,
        description: helpName.map(i => `**${i}** - ${helpList[i]}`).join(`,\n`),
        color,
        timestamp,
        footer: {
          text: `Для информации о команде - введите ${pref}${commandName} имя-команды. Вместо ${commandName} - вы можете использовать его альтернативные названия`,
          icon_url,
        }
      }]
    });

    if (!(helpCommandName in helpList)) return message.channel.send({
      embeds: [{
        title: `Ошибка`,
        description: `Хочу вас огорчить - в списке команд такой команды (${helpCommandName.length >= 501 ? `${helpCommandName.slice(0, 500)}...` : helpCommandName}) нет.`,
        color: parseInt(`ff2500`, 16),
        timestamp,
        footer: {
          text: `Список доступных команд можно глянуть в ${pref}${commandName}. Без дополнительных аргументов`,
          icon_url,
        }
      }]
    });

    message.channel.send({
      embeds: [{
        title: helpCommandName,
        description: helpList[helpCommandName],
        color,
        timestamp,
        footer: {
          text: `\u200b`,
          icon_url,
        }
      }]
    });
  }
}