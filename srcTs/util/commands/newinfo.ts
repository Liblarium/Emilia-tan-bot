import { db } from "@client";
import { hexToDecimal, stringToBigInt } from "@util/s";
import type { APIEmbed } from "discord.js";

export async function updateUserBio({
  userId,
  newBio
}: { userId: string | bigint, newBio: string }): Promise<APIEmbed> {
  if (typeof userId === "string") userId = stringToBigInt(userId);

  const title = "Обновление информации о себе";
  const errColor = hexToDecimal("#ff2500");

  if (!newBio || newBio.length === 0 || newBio.length >= 1025) return {
    title,
    description: newBio.length === 0 || !newBio ? "Текст для информации о себе не может быть пустым" : `Размер текста для информации о себе больше 1024 (у вас: ${newBio.length}) символов не принимается`,
    color: errColor,
    footer: {
      text: "Попробуйте ещё раз. Но в этот раз учтите условия выше"
    }
  };

  const user = await db.user.findFirst({ where: { id: userId }, select: { id: true } });

  if (!user) return {
    title,
    description: "Похоже вас нет в БД. Отправьте любое сообщение в чат или попробуйте ещё раз.\n Если вы видите это снова - обратитесь к Мии",
    color: errColor
  };

  const updateBio = await db.user.update({
    where: { id: userId },
    data: { bio: newBio },
    select: { bio: true }
  });

  if (!updateBio) return {
    title,
    description: "Похоже что-то пошло не так. Попробуйте ещё раз или обратитесь к Мии",
    color: errColor
  };

  return {
    title,
    description: "Ваша информация о себе обновлена! Можете глянуть с помощью </profile:1018822028565946379>",
    color: hexToDecimal("#25ff00"),
    footer: {
      text: `Размер нового о себе: ${updateBio.bio.length} символов`
    }
  };
}