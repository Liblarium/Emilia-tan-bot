import { db } from "@client";
import { displayColor, hexToDecimal, stringToBigInt } from "@util/s";
import type { APIEmbed } from "discord.js";

export async function editPol({
  id,
  color,
  pol,
}: { id: bigint | string; color: number | string; pol?: string }): Promise<APIEmbed> {
  if (typeof id === "string") id = stringToBigInt(id);

  color = displayColor(color, "#8b949e");
  const errColor = hexToDecimal("#ff2500");
  const user = await db.user.findFirst({
    where: { id },
    select: { pol: true },
  });

  if (!user)
    return {
      title: "Обновление пола",
      description:
        "По вашему id не было найдено совпадений в БД. Отправьте любое сообщение в чат или попробуйте ещё раз.\n Если вы видите это снова - обратитесь к Мии",
      color: errColor,
      footer: { text: "Возможно, на этом сервере не включена запись в БД." },
    };

  if (!pol)
    return {
      title: "Текущий пол",
      description: `Ваш текущий пол: ${user.pol}`,
      color,
      footer: { text: "Если вы хотите изменить пол - просто введите новый пол в аргументы команды" },
    };

  if (pol.length > 50) return {
    title: "Обновление пола",
    description: `Вы не можете выбрать пол, который содержит более 50 (у вас: ${pol.length}) символов!`,
    color: errColor,
    footer: {
      text: "Попробуйте ещё раз. Но в этот раз используйте короче название.",
    }
  };

  if (user.pol === pol) return {
    title: "Обновление пола",
    description: "Вы не можете выбрать тот-же пол, что у вас уже стоит!",
    color: errColor,
    footer: {
      text: "Попробуйте ещё раз. Но в этот раз выберите другой пол.",
    }
  };

  const newPol = await db.user.update({ where: { id }, data: { pol }, select: { pol: true } });

  return {
    title: "Обновление пола",
    description: `Вы успешно изменили пол на ${newPol.pol}`,
    color,
  };
}
