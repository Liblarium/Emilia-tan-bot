import type { Message } from "discord.js";
import { BaseCommand } from "../../base/command";
import { Database } from "../../database";
import { Log } from "../../log";

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

  async execute(message: Message, args: string[]): Promise<Log | undefined | Message> {
    if (
      !message.guild ||
      !message.member ||
      message.member.user.bot ||
      message.webhookId != null
    )
      return;

    const db = new Database();
    const guilddb = await db.findOneBy("guilds", { id: message.guild.id });
    const newPrefix = args[0];

    if (guilddb.error) {
      message.channel
        .send({
          content:
            "Произошла ошибка при проверке наличия сервера в БД! (Возможно его нет в БД)",
        })
        .catch(catchs);
      return new Log({
        text: guilddb.error,
        type: 2,
        categories: ["global", "command", "pgsql"],
      });
    }

    const res = guilddb.res;

    if (!res) {
      message.channel
        .send({ content: "Похоже произошла ошибка и с БД ничего не вывело." })
        .catch(catchs);
      return new Log({
        text: "Результаты от БД пустые!",
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

      if (newPrefix === res.prefix?.now)
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

      const updPrefix = await db.update(
        "guilds",
        { id: message.guild.id },
        { prefix: { now: newPrefix } },
      );

      if (updPrefix.error)
        return new Log({
          text: updPrefix.error,
          type: 2,
          categories: ["global", "command", "psql"],
        });
      message.channel.send({
        content: "При изменении префикса - произошла ошибка.",
      }).catch(catchs);

      return message.channel
        .send({
          embeds: [
            {
              title,
              description: `Новый префикс ${newPrefix} установлен.`,
              color: 2_490_112,
              footer: {
                text: `Стандартный префикс: ${res.prefix?.default ?? "[Ошибка]"}`,
              },
            },
          ],
        })
        .catch(catchs) as unknown as Message | undefined;
    }

    message.channel
      .send({
        embeds: [
          {
            title: "Префикс бота",
            description: `Установленный префикс на сервере: **${res.prefix?.now ?? "[Ошибка]"}**, стандартный префикс: ${res.prefix?.default ?? "[Ошибка]"}`,
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
