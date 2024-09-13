import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { db } from "@database";
import { users } from "@schema/user";
import type { Message } from "discord.js";
import { eq } from 'drizzle-orm';

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
    if (!message.guild || !message.member) return;
    if (message.guild.id !== "451103537527783455") return;

    const userId = BigInt(message.member.user.id);
    const userPol = await db.query.users.findFirst({
      where: eq(users.id, userId), columns: { pol: true }
    });

    if (!userPol) return message.channel.send({ content: "Похоже вас нет в Базе Данных." });
    if (!args[0]) return message.channel.send({ content: `Ваш пол: ${userPol.pol === "неизвестно" ? "[не указан]" : userPol.pol}` });

    const updPol = await db.update(users).set({ pol: args[0] }).where(eq(users.id, userId)).returning({ pol: users.pol });

    if (updPol.length > 0) return message.channel.send({ content: `Ваш пол был изменен на ${args[0]}` });
    message.channel.send({ content: "Похоже что-то пошло не так. Попробуйте ещё раз или обратитесь к Мии." });

    message.channel.send({ content: "Ваш пол был обновлён в БД!" });
  }
}

