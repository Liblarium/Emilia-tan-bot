import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import type { Message } from "discord.js";

export default class Pol extends BaseCommand {
  constructor() {
    super({
      name: "pol",
      option: {
        type: "command",
        delete: true,
      },
      description: "Изменение пола в профиле/просмотр вашего пола в профиле",
    });
  }

  async execute(message: Message, args: string[], commandName: string, client: EmiliaClient) {
    if (!message.guild || !message.member || message.channel.isDMBased()) return;
    if (message.guild.id !== "451103537527783455") return;

    const userId = BigInt(message.member.user.id);
    const userPol = await client.db.user.findFirst({
      where: { id: userId }, select: { pol: true }
    });

    if (!userPol) return message.channel.send({ content: "Похоже вас нет в Базе Данных." });
    if (!args[0]) return message.channel.send({ content: `Ваш пол: ${userPol.pol === "неизвестно" ? "[не указан]" : userPol.pol}` });

    const updPol = await client.db.user.update({ where: { id: userId }, data: { pol: args[0] } });

    if (!updPol.pol) return message.channel.send({ content: `Ваш пол был изменен на ${args[0]}` });
    message.channel.send({ content: "Похоже что-то пошло не так. Попробуйте ещё раз или обратитесь к Мии." });

    message.channel.send({ content: "Ваш пол был обновлён в БД!" });
  }
}

