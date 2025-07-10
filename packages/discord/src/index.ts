import {
  type BaseMessageOptions,
  ChatInputCommandInteraction,
  type InteractionResponse,
  Message,
  MessageComponentInteraction,
  MessageFlags,
  MessageFlagsBitField,
} from "discord.js";

/**
 * Sends a reply to a given context, which can be a `Message`, `ChatInputCommandInteraction`,
 * or `MessageComponentInteraction`.
 *
 * If the context is a `Message`, it replies directly to
 * the message.
 *
 * For `interaction` contexts, it `uses` flags to determine the visibility
 * (e.g., `ephemeral`).
 *
 * Throws an `error` if the context `type` is `unsupported`.
 *
 * @param {ReplyContext} context - The context to which the reply is sent.
 * @param {BaseMessageOptions} content - The content of the reply.
 * @param {ReplyOptions} [options] - Additional options for the reply such as flags or ephemeral status.
 * @returns {Promise<Message | InteractionResponse>} A `promise` that resolves with the sent `message` or `interaction` response.
 * @throws {Error} Throws if the context type is not supported.
 */
export async function reply(
  context: ReplyContext,
  content: BaseMessageOptions,
  options?: ReplyOptions
): Promise<Message | InteractionResponse> {
  if (context instanceof Message) {
    if (!options?.flags) return context.reply(content);

    return context.reply({ ...content, flags: options.flags });
  }

  if (
    context instanceof ChatInputCommandInteraction ||
    context instanceof MessageComponentInteraction
  ) {
    const flags = new MessageFlagsBitField(options?.flags ?? 0);

    if (options?.ephemeral) flags.add(MessageFlags.Ephemeral);

    return context.reply({ ...content, flags: flags.toJSON() });
  }

  throw new Error(
    "Only Message, ChatInputCommandInteraction, and MessageComponentInteraction are supported."
  );
}

type ReplyContext = Message | ChatInputCommandInteraction | MessageComponentInteraction;

type ReplyOptions = {
  ephemeral?: boolean;
  flags?: ReplyFlags;
};

type ReplyFlags =
  | MessageFlags.SuppressEmbeds
  | MessageFlags.SuppressNotifications
  | MessageFlags.IsComponentsV2;
