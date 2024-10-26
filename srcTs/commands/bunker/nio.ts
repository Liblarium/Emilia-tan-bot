import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import type { Message } from "discord.js";

export default class NewInfo extends BaseCommand {
  constructor() {
    super({
      name: "newinfo",
      option: {
        type: "command",
        aliases: ["nio"],
        delete: true,
      },
      description: "Изменение информации о себе",
    });
  }

  async execute(
    message: Message,
    args: string[],
    commandName: string,
    client: EmiliaClient,
  ) {
    if (
      !message.guild ||
      !message.member ||
      !client.user ||
      message.channel.isDMBased()
    )
      return;

    const userId = BigInt(message.member.user.id);
    const user = await client.db.user.findFirst({
      where: { id: userId },
      select: { bio: true }
    });
    const title = "Обновление информации о себе";
    const color = {
      error: 0xff_25_00,
      success: 0x25_ff_00,
    };
    const icon_url =
      message.guild.members.cache
        .get(client.user.id)
        ?.displayAvatarURL({ forceStatic: false }) ?? undefined;

    if (!user)
      return message.channel.send({
        embeds: [
          {
            title,
            description: "Похоже вас нет в Базе Данных",
            color: color.error,
            footer: {
              text: "Эта команда доступна только для пользователей, что есть в Базе Данных",
              icon_url,
            },
          },
        ],
      });

    if (!args || args.length <= 0)
      return message.channel.send({
        embeds: [
          {
            title,
            description: "Вы ничего не ввели, дабы изменить информацию о себе",
            color: color.error,
          },
        ],
      });

    if (args.length >= 1025)
      return message.channel.send({
        embeds: [
          {
            title,
            description: `Больше 1024 (${args.length}) я не принимаю.`,
            color: color.error,
            footer: {
              text: "Попробуйте написать по меньше информации о себе",
              icon_url,
            },
          },
        ],
      });

    if (args.length <= 1024) {
      const newBio = await client.db.user.update({ where: { id: userId }, data: { bio: args.join(" ") }, select: { bio: true } });

      if (!newBio.bio)
        return message.channel.send({
          embeds: [
            {
              title,
              description:
                "Похоже что-то пошло не так. Попробуйте ещё раз или обратитесь к Мии.",
              color: color.error,
              footer: {
                text: "Возможно - проблема на стороне Базы Данных",
                icon_url,
              },
            },
          ],
        });

      message.channel.send({
        embeds: [
          {
            title,
            description: "Ваша информация успешно обновлена!",
            color: color.success,
            footer: {
              text: `Размер новой информации о себе - ${args.join(" ").length} символов`,
              icon_url,
            },
          },
        ],
      });
    }
  }
}
