import { BaseCommand } from "@base/command";
import { db } from "@database";
import { Log } from "@log";
import { guild } from "@schema/guild";
import { prefix } from "@util/s";
import type { Message } from "discord.js";
import { eq } from "drizzle-orm";

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

  async execute(message: Message, args: string[]): Promise<Log | undefined | Message | void> {
    if (
      !message.guild ||
      !message.member ||
      message.member.user.bot ||
      message.webhookId != null
    )
      return;
    const guildId = BigInt(message.guild.id);
    const guilddb = await db.query.guild.findFirst({ where: eq(guild.id, guildId), columns: { prefix: true } });
    const newPrefix = args[0];

    if (guilddb === undefined) {
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
                description: "Максимально-доступный размер префикса - 5. Такой размер был установлен, дабы людям не нужно было вводить киллометровый префикс)",
                footer: {
                  text: `Размер вашего префиса: ${newPrefix.length.toString()}.`,
                },
              },
            ],
          })
          .catch(catchs) as unknown as Message | undefined;

      if (newPrefix === guilddb.prefix?.now)
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

      const updPrefix = await db.update(guild).set({ prefix: { default: prefix, now: newPrefix } }).where(eq(guild.id, guildId)).returning({ prefix: guild.prefix });

      if (updPrefix.length < 0 || updPrefix.length > 0 && updPrefix[0].prefix === null) {
        new Log({
          text: "При изменении префикса - произошла ошибка.",
          type: 2,
          categories: ["global", "command", "psql"],
        });

        return message.channel.send({
          content: "При изменении префикса - произошла ошибка.",
        }).catch(catchs);
      }

      return message.channel
        .send({
          embeds: [
            {
              title,
              description: `Новый префикс ${newPrefix} установлен.`,
              color: 2_490_112,
              footer: {
                text: `Стандартный префикс: ${guilddb.prefix?.default ?? prefix ?? "[Ошибка]"}`,
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
            description: `Установленный префикс на сервере: **${guilddb.prefix?.now ?? "[Ошибка]"}**, стандартный префикс: ${guilddb.prefix?.default ?? "[Ошибка]"}`,
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
