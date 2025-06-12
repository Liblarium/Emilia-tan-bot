import type { Message, PartialMessage } from "discord.js";

/**
 * Clip a message content to a given limit, append an ellipsis if the content is longer than the limit.
 * If the message doesn't have content, return a string indicating that there were attachments or stickers.
 * @param {Message} message - The message to clip.
 * @param {number} [limit=4000] - The maximum length of the content to clip to.
 * @returns {string} The clipped content.
 */
export function clipMessageLog(message: Message | PartialMessage, limit: number = 4000): string {
  const EMPTY_MESSAGE = "[Пустое сообщение]";
  const ATTACHMENT_MESSAGE = "[Тут было вложение]";

  if (!message) return EMPTY_MESSAGE;

  if (message.content) {
    if (message.content.length === 0) return EMPTY_MESSAGE;

    if (message.content.length > limit) return `${message.content.slice(0, limit - 3)}...`;

    return `${message.content}\u200b`;
  }

  const hasAttachments = (message.attachments?.size ?? -1) > 0;
  const hasStickers = (message.stickers?.size ?? -1) > 0;
  const hasEmbeds = (message.embeds?.length ?? -1) > 0;
  const hasComponents = (message.components?.length ?? -1) > 0;

  return hasAttachments || hasStickers || hasEmbeds || hasComponents
    ? ATTACHMENT_MESSAGE
    : EMPTY_MESSAGE;
}
