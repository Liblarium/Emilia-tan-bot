import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { Log } from "@log";
import { EmiliaTypeError } from "@util/s";
import type { Message } from "discord.js";

export default class Potion extends BaseCommand {
  constructor() {
    super({
      name: "potion",
      commandType: "command",
      option: {
        delete: true,
        test: true,
        testers: ["477456988817719307"],
      },
      //description: "Изменение возможности становление чтецом",
    });
  }

  async execute(
    message: Message,
    args: string[],
    commandName: string,
    client: EmiliaClient,
  ) {
    if (!message.guild || !message.member || message.channel.isDMBased()) return;

    const db = client.db;
    const member =
      message.mentions.members?.first() ||
      message.guild?.members.cache.get(args[0]);

    let newPotion = 0;
    let minPotion: number;
    let maxPotion: number;
    const potions = args[1];

    if (message.member.user.id === "211144644891901952")
      (minPotion = -1), (maxPotion = 100);
    else (minPotion = 0), (maxPotion = 100);
    if (potions) newPotion = Number.parseInt(potions);
    if (!member) return message.channel.send({ content: "Вы не упомянули никого/не дали id пользователя!" });

    const userId = BigInt(member.user.id);
    if (member.roles.cache.has("748102803741736960") || member.user.bot)
      return message.channel.send({
        content: "Низя изменить значение для чтеца (ур доступа) или бота!",
      });

    const user = await db.user.findFirst({
      where: { id: userId },
      select: { potion: true },
    });

    if (!user || !user.potion)
      return message.channel.send({
        content: "Вы уверенны, что указанный пользователь есть в БД?",
      });

    if (potions) {
      if (user.potion > -1 && user.potion < 100) {
        if (newPotion === user.potion) return message.channel.send({ content: "У этого пользователя уже стоит это значение!" });
        if (Number.isNaN(newPotion)) return message.channel.send({ content: `${newPotion} не является числом!` });
        if (newPotion < minPotion && newPotion > maxPotion) return message.channel.send({ content: `Число ${newPotion} ${newPotion < minPotion ? "меньше минимального" : "больше максимального"} значения!` });

        const upd = await db.user.update({ where: { id: userId }, data: { potion: newPotion }, select: { potion: true } });

        if (!upd.potion) return new EmiliaTypeError(`Произошла ошибка при обновлении ${member.user.username} (${member.user.id}) количества potion!`);
        new Log({ text: `${member.user.username} имеет ${newPotion} potion сейчас!`, type: "error", categories: ["global", "potion", "db"] });
        message.channel.send({ content: "Обновлено!" });
      } else if (user.potion === -1 && message.member.id === "211144644891901952" || user.potion === 100 && message.member.id === "211144644891901952") {
        if (newPotion === user.potion) return message.channel.send({ content: "Низя просто взять и выдать то же самое количество!" });
        const upd = await db.user.update({ where: { id: userId }, data: { potion: newPotion }, select: { potion: true } });

        if (!upd.potion) return new EmiliaTypeError(`Произошла ошибка при обновлении ${member.user.username} (${member.user.id}) количества potion!`);
        new Log({ text: `${member.user.username} имеет ${newPotion} potion сейчас!`, type: "error", categories: ["global", "potion", "db"] });
      } else {
        message.channel.send({ content: "Если ты хочешь изменить юзера с 100 или -1, то тыкай Мию)" });
      }
    } else message.channel.send({ embeds: [{ title: "\"Карточка\" Пользователя", description: `Пользователь: ${member}\n"Очки": ${user.potion}/100`, footer: { text: "-1 - это вне доступа. 100 - кандидат в чтецы или им является. P.S. Возможно - позже сделаю картинкой)" } }] });
  }
}
