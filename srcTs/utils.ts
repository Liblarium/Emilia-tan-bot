/// <reference types="../types/util/utils.d.ts" />

/**
 * @fileoverview Utility functions
 * @author RanHolly
 * @license MIT
 */

import { db } from "@client";
import { Log } from "@log";
import type { JsonValue } from "@prisma/client/runtime/library";
import {
  type APIModalInteractionResponseCallbackData,
  type ActionRow,
  type AnyComponent,
  type ChatInputCommandInteraction,
  GuildMember,
  type InteractionReplyOptions,
  type Message,
  type MessageActionRowComponent,
  MessageComponentInteraction,
  type PartialMessage,
  type RepliableInteraction,
} from "discord.js";

/**
 * Get time in format "HH:MM:SS"
 * @returns {string}
 */
const time = (): string => {
  const date = new Date();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");
  return `${hour}:${minute}:${second}`;
};

/**
 * Get time in format "HH:MM:SS:MMM"
 * @returns {string}
 */
const logTime = (): string => {
  const date = new Date();
  const millisecond = date.getMilliseconds().toString().padStart(3, "0");
  return `${time()}:${millisecond}`;
};

/**
 * Get date in format "DD.MM.YYYY"
 * @returns {string}
 */
const date = (): string => {
  const date = new Date();
  const data = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${data}.${month}.${year}`;
};

/**
 * Get date and time in format "[DD.MM.YYYY][HH:MM:SS]"
 * @returns {string}
 */
const dateAndTime = (): string => `[${date()}][${logTime()}]`;

/**
 * Remove newline from text
 * @param {string} text - text to remove newline from
 * @returns {string} - text without newline
 */
const offNewLine = (text: string): string => {
  const newLinePattern = /\r?\n$/;
  const line = text.toString();

  if (line.endsWith("\n") || newLinePattern.test(line))
    return line.slice(0, -2);

  return line;
};

/**
 * Check if object is a class
 * @param {unknown} obj - object to check
 * @returns {boolean} - true if class, false otherwise
 */
const isClass = (obj: unknown): boolean =>
  typeof obj === "function" && /^\s*class\s+/.test(obj.toString());

/**
 * Reply to interaction
 * @param {object} args - arguments
 * @param {RepliableInteraction} args.interaction - interaction to reply to
 * @param {InteractionReplyOptions} args.message - message to send
 * @returns {Promise<isReplyOptions>}
 */
const isReply = async ({
  interaction,
  message,
}: {
  interaction: RepliableInteraction;
  message: InteractionReplyOptions;
}): Promise<void> => {
  await interaction.reply({ ...message });
};

/**
 * Show modal
 * @param {object} args - arguments
 * @param {MessageComponentInteraction | ChatInputCommandInteraction} args.interaction - interaction to show modal to
 * @param {APIModalInteractionResponseCallbackData} args.modal - modal to show
 * @returns {Promise<void>}
 */
const isModal = async ({
  interaction,
  modal,
}: {
  interaction: MessageComponentInteraction | ChatInputCommandInteraction;
  modal: APIModalInteractionResponseCallbackData;
}): Promise<void> => {
  await interaction.showModal(modal);
};

/**
 * Return "первом", "втором" or "обеих" depending on which of `a` and `b` are numbers.
 * @param {number} [a] - first argument
 * @param {number} [b] - second argument
 * @returns {string} - "первом", "втором" or "обеих"
 */
function isComponentErrorMessage(a: number, b?: number): string {
  return typeof a === "number"
    ? "первом"
    : typeof b === "number"
      ? "втором"
      : "обеих";
}

/**
 * Return error string if `a` or `b` are not numbers in range from 0 to 4.
 * @param {number} [a] - first argument
 * @param {number} [b] - second argument
 * @returns {string | undefined} - error string if `a` or `b` are not numbers in range from 0 to 4, otherwise - undefined
 */
function isComponentsLogic(a: number, b?: number): string | undefined {
  if (typeof a !== "number" || (b !== undefined && typeof b !== "number")) {
    return `Вы ввели не числовое значение в ${isComponentErrorMessage(a, b)} аргумент${typeof a !== "number" && typeof b !== "number" ? "ах" : "е"} components!`;
  }
  if (a < 0 || a >= 5) {
    return "Вы ввели значение меньше 0 или больше 4 в первом аргументе components!";
  }
  if (b !== undefined && (b < 0 || b >= 5)) {
    return "Вы ввели значение меньше 0 или больше 4 в втором аргументе components!";
  }
}

/**
 * Get components from message
 * @param {object} args - arguments
 * @param {MessageComponentInteraction} args.interaction - interaction to get components from
 * @param {{ a: number, b?: number }} args.componentOptions - options to get components. a - first component, b - second
 * @returns {AnyComponent | ActionRow<MessageActionRowComponent> | string} - components or string if error
 */
function isComponents({
  interaction,
  components = { a: 0 },
}: {
  interaction: MessageComponentInteraction;
  components: { a: number; b?: number };
}): AnyComponent | ActionRow<MessageActionRowComponent> | string {
  if (!(interaction instanceof MessageComponentInteraction)) {
    return "Переменная interaction обязательная!";
  }

  const comps = interaction.message.components;
  const { a, b } = components;
  const errors = isComponentsLogic(a, b);

  if (errors) return errors;

  return b !== undefined ? comps[a].components[b].data : comps[a];
}

/**
 * Log message to console
 * @param {unknown} message - message to log
 * @param {...unknown} optionalParams - additional params to log
 * @returns {void}
 */
const log = (message?: unknown, ...optionalParams: unknown[]): void => {
  console.log(`[${time()}][Эмилия-тан | Info]:`, message, ...optionalParams);
};

/**
 * Log error to console
 * @param {unknown} message - message to log
 * @param {...unknown} optionalParams - additional params to log
 * @returns {void}
 */
const error = (message?: unknown, ...optionalParams: unknown[]): void => {
  console.error(`[${time()}][Эмилия-тан | Error]:`, message, ...optionalParams);
};

/**
 * Emilia error class
 * @class
 * @extends Error
 */
class EmiliaTypeError extends TypeError {
  constructor(message?: string) {
    super(message);
    this.name = `[${time()} | Emilia | TypeError]`;
    new Log({
      text: message,
      type: "error",
      categories: ["global", "typeError"],
      logs: false,
    });
  }
}

/**
 * Emilia error class
 * @class
 * @extends Error
 */
class EmiliaError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = `[${time()} | Emilia | Error]`;
    new Log({
      text: message,
      type: "error",
      categories: ["global", "typeError"],
      logs: false,
    });
  }
}

/**
 * Generate random number
 * @param {number} min - min number
 * @param {number} max - max number
 * @returns {number} - generated number
 */
const random = (min: number, max: number): number => {
  if (min >= max)
    throw new EmiliaTypeError(
      `Аргумент min (${min.toString()}) не может быть больше или равно аргументу max (${max.toString()})!`,
    );
  const random = Math.floor(Math.random() * (max - min + 1)) + min;

  return random > max ? random - 1 : random;
};

/**
 * Default prefix for all message commands
 * @type {string} - If prefix in database is not set or guild not found in database - use this prefix
 * @default "++" //in database too
 */
const prefix: string = "++";

/**
 * Convert a string to a BigInt.
 *
 * @param {string} str - The string to convert to a BigInt
 * @returns {bigint} - The BigInt representation of the input string
 */
const stringToBigInt = (str: string): bigint => {
  if (typeof str !== "string")
    throw new EmiliaError("[utils.stringToBigInt]: str must be a string!");
  if (!str || str.length === 0)
    throw new EmiliaError("[utils.stringToBigInt]: str must not be empty!");

  return BigInt(str);
};

/**
 * Parse a JsonValue to a typed value.
 *
 * @remarks
 * This function is a cast of the JsonValue to the specified type.
 * It is up to the caller to ensure that the JsonValue is actually of the specified type.
 *
 * @typeParam T - The type to parse the JsonValue to
 * @param {JsonValue} jsonValue - The JsonValue to parse
 * @returns {T} - The parsed JsonValue
 */
function parseJsonValue<T>(jsonValue: JsonValue): T {
  return jsonValue as T;
}

/**
 * Converts a hexadecimal string to a decimal number.
 *
 * @param {string} hex - The hexadecimal string to convert. It can optionally start with "0x" or "#".
 * @returns {number} - The decimal number representation of the hexadecimal string.
 */
function hexToDecimal(hex: string): number {
  if (hex.startsWith("0x")) hex = hex.slice(2);
  if (hex.startsWith("#")) hex = hex.slice(1);

  return Number.parseInt(hex, 16);
}

/**
 * Replaces a color with another color if it is 0.
 *
 * @param {number|string} color - The color to replace. It can be a number or a hexadecimal string.
 * @param {number|string} replacedColor - The color to replace with. It can be a number or a hexadecimal string.
 * @returns {number} - The replaced color if the color is 0, or the original color if it is not 0.
 */
function displayColor(
  color: number | string,
  replacedColor: number | string,
): number {
  if (typeof color === "string") color = hexToDecimal(color);
  if (typeof replacedColor === "string")
    replacedColor = hexToDecimal(replacedColor);

  return color === 0 ? replacedColor : color;
}

/**
 * Checks if a given value is an instance of GuildMember
 * @param member - unknown value to check
 * @returns whether the value is an instance of GuildMember
 */
function isGuildMember(member: unknown): member is GuildMember {
  return member instanceof GuildMember;
}

type GuildLogSelect = {
  message?: boolean;
  channel?: boolean;
  role?: boolean;
  emoji?: boolean;
  member?: boolean;
  guild?: boolean;
};

/**
 * Finds a guild in the database and returns the selected log setting columns.
 *
 * @param {bigint} guildId - The ID of the guild to find.
 * @param {GuildLogSelect} select - The columns to select from the database.
 * @returns - The selected columns from the guild log setting if the guild is found, otherwise false.
 */
async function getGuildLogSettingFromDB(
  guildId: bigint,
  select: GuildLogSelect,
  intents: number,
) {
  const guild = await db.guild.findFirst({
    where: { id: guildId },
    select: { logModule: true, logIntents: true, ...select },
  });

  if (!guild || !guild.logModule || !(guild.logIntents & intents)) return false;

  return guild;
}

/**
 * Clip a message content to a given limit, append an ellipsis if the content is longer than the limit.
 * If the message doesn't have content, return a string indicating that there were attachments or stickers.
 * @param {Message} message - The message to clip.
 * @param {number} [limit=4000] - The maximum length of the content to clip to.
 * @returns {string} The clipped content.
 */
function clipMessageLog(
  message: Message | PartialMessage,
  limit?: number,
): string {
  if (!limit) limit = 4000;

  if (message.content)
    return message.content.length > limit
      ? `${message.content.slice(0, limit - 3)}...`
      : message.content;
  return message.attachments.size > 0 || message.stickers.size > 0
    ? "[Тут было вложение]"
    : "[Пустое сообщение]";
}

//Enums

/**
 * Event actions
 * @enum {number}
 */
enum EventActions {
  /**
   * Someone joins the guild/voice
   */
  JOIN = 1 << 0,
  /**
   * Someone leaves the guild/voice
   */
  LEAVE = 1 << 1,
  /**
   * A new channel/role/emoji is created
   */
  CREATE = 1 << 2,
  /**
   * A channel/role/emoji/guild/member is updated
   */
  UPDATE = 1 << 3,
  /**
   * A channel/role/emoji is deleted
   */
  DELETE = 1 << 4,
}

/**
 * Guild logs intents
 * @enum {number}
 */
enum GuildLogsIntents {
  /**
   * Guild update event
   */
  GUILD = (1 << 0) | EventActions.UPDATE, // 8

  /**
   * Guild member join/leave event
   */
  GUILD_MEMBER = (1 << 1) | (EventActions.JOIN | EventActions.LEAVE), // 3

  /**
   * Channel create/update/delete event
   */
  CHANNEL = (1 << 2) |
  EventActions.CREATE |
  EventActions.UPDATE |
  EventActions.DELETE, // 28

  /**
   * Role create/update/delete event
   */
  ROLE = (1 << 5) |
  (EventActions.CREATE | EventActions.UPDATE | EventActions.DELETE), // 60

  /**
   * Emoji create/update/delete event
   */
  EMOJI = (1 << 6) |
  (EventActions.CREATE | EventActions.UPDATE | EventActions.DELETE), // 92

  /**
   * Voice state update event
   */
  VOICE_STATE = (1 << 7) | (EventActions.JOIN | EventActions.LEAVE), // 131

  /**
   * Message update/delete event
   */
  MESSAGE = (1 << 8) |
  (EventActions.CREATE | EventActions.UPDATE | EventActions.DELETE), // 284

  /**
   * All events
   */
  ALL = (1 << 9) |
  GUILD |
  GUILD_MEMBER |
  CHANNEL |
  ROLE |
  EMOJI |
  VOICE_STATE |
  MESSAGE, //1023
}

export {
  time,
  logTime,
  date,
  dateAndTime,
  offNewLine,
  isClass,
  isReply,
  isModal,
  isComponents,
  log,
  error,
  random,
  stringToBigInt,
  parseJsonValue,
  hexToDecimal,
  displayColor,
  isGuildMember,
  getGuildLogSettingFromDB,
  clipMessageLog,
  EmiliaTypeError,
  EmiliaError,
  EventActions,
  GuildLogsIntents,
  prefix,
};
