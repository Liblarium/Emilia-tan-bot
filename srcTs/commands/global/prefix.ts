import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { Log } from "@log";
import type { GuildPrefix } from "@type/command";
import { parseJsonValue, prefix } from "@util/s";
import type { Message } from "discord.js";

const title = "Смена префикса";
const catchs = (e: unknown) => {
  console.error(e);
};

export default class Prefix extends BaseCommand {
  constructor() {
    super({
      name: "prefix",
      option: {
        type: "command",
        delete: true,
      },
    });
  }

  async execute(
    message: Message,
    args: string[],
    commandName: string,
    client: EmiliaClient,
  ): Promise<Log | undefined | Message | void> {
    if (
      !message.guild ||
      !message.member ||
      message.member.user.bot ||
      message.webhookId != null ||
      message.channel.isDMBased()
    )
      return;
    const guildId = BigInt(message.guild.id);
    const guildDB = await client.db.guild.findFirst({
      where: { id: guildId },
      select: { prefix: true },
    });
    const newPrefix = args[0];

    if (guildDB === null) {
      message.channel
        .send({
          content:
            "Произошла ошибка при проверке наличия сервера в БД! (Возможно его нет в БД)",
        })
        .catch(catchs);
      return new Log({
        text: "Произошла ошибка при проверке наличия сервера в БД! (Возможно его нет в БД)",
        type: 2,
        categories: ["global", "command", "pgsql"],
      });
    }

    if (newPrefix && message.member.user.id === message.guild.ownerId) {
      if (newPrefix.length >= 6)
        return message.channel
          .send({
            embeds: [
              {
                title,
                description:
                  "Максимально-доступный размер префикса - 5. Такой размер был установлен, дабы людям не нужно было вводить километровый префикс)",
                footer: {
                  text: `Размер вашего префикса: ${newPrefix.length.toString()}.`,
                },
              },
            ],
          })
          .catch(catchs) as unknown as Message | undefined;

      if (
        guildDB.prefix &&
        newPrefix === parseJsonValue<GuildPrefix>(guildDB.prefix).now
      )
        return message.channel.send({
          embeds: [
            {
              title,
              description: `Вы ввели тот-же префикс, что был) (${newPrefix})`,
              footer: {
                text: "Для просмотра префикса - введите команду без доп аргументов.",
              },
            },
          ],
        });

      const updPrefix = await client.db.guild.update({
        where: { id: guildId },
        data: { prefix: { default: prefix, now: newPrefix } },
        select: { prefix: true },
      });

      if (!updPrefix.prefix) {
        new Log({
          text: "При изменении префикса - произошла ошибка.",
          type: 2,
          categories: ["global", "command", "psql"],
        });

        return message.channel
          .send({
            content: "При изменении префикса - произошла ошибка.",
          })
          .catch(catchs);
      }

      return message.channel
        .send({
          embeds: [
            {
              title,
              description: `Новый префикс ${newPrefix} установлен.`,
              color: 2_490_112,
              footer: {
                text: `Стандартный префикс: ${parseJsonValue<GuildPrefix>(guildDB.prefix).default ?? "[Ошибка]"}`,
              },
            },
          ],
        })
        .catch(catchs);
    }

    message.channel
      .send({
        embeds: [
          {
            title: "Префикс бота",
            description: `Установленный префикс на сервере: **${parseJsonValue<GuildPrefix>(guildDB.prefix).now ?? "[Ошибка]"}**, стандартный префикс: ${parseJsonValue<GuildPrefix>(guildDB.prefix).default} ?? "[Ошибка]"`,
            color: 0x25_ff_00,
            footer: {
              text: "Владелец сервера может сменить префикс для сервера",
            },
          },
        ],
      })
      .catch(catchs);
  }
}
