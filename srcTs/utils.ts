/// <reference types="../types/util/utils.d.ts" />

/**
 * @fileoverview Utility functions
 * @author RanHolly
 * @license MIT
 */

import { Log } from "@log";
import {
  type ActionRow,
  type AnyComponent,
  type ChatInputCommandInteraction,
  type InteractionReplyOptions,
  type MessageActionRowComponent,
  MessageComponentInteraction,
  type ModalComponentData,
  type RepliableInteraction,
} from "discord.js";


/**
 * Guild log permission flags
 * @enum {number}
 * @property {number} CREATE - 1. Log create channel/role
 * @property {number} DELETE - 2. Log delete channel/role/message
 * @property {number} UPDATE - 4. log update channel/role/message/guild (?)
 * @property {number} JOIN - 8. Log to join in voice channel or guild
 * @property {number} LEAVE - 16. Log to leave from voice channel or guild
 */
const GUILD_PERMISSIONS = { //guild logs in db
  CREATE: 1 << 0, // 1
  DELETE: 1 << 1, // 2
  UPDATE: 1 << 2, // 4
  JOIN: 1 << 3, // 8
  LEAVE: 1 << 4, // 16
};

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
const isReply = async (
  { interaction, message }: { interaction: RepliableInteraction, message: InteractionReplyOptions },
): Promise<void> => {
  await interaction.reply({ ...message });
};

/**
 * Show modal
 * @param {object} args - arguments
 * @param {MessageComponentInteraction | ChatInputCommandInteraction} args.interaction - interaction to show modal to
 * @param {ModalComponentData} args.modal - modal to show
 * @returns {Promise<void>}
 */
const isModal = async (
  { interaction, modal }: { interaction: MessageComponentInteraction | ChatInputCommandInteraction, modal: ModalComponentData },
): Promise<void> => {
  await interaction.showModal(modal);
};

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
}: { interaction: MessageComponentInteraction, components: { a: number, b?: number } }):
  | AnyComponent
  | ActionRow<MessageActionRowComponent>
  | string {
  if (!(interaction instanceof MessageComponentInteraction)) {
    return "Переменная interaction обязательная!";
  }

  const comps = interaction.message.components;
  const { a, b } = components;

  if (typeof a !== "number" || (b !== undefined && typeof b !== "number")) {
    return `Вы ввели не числовое значение в ${typeof a === "number" ? "первом" : typeof b === "number" ? "втором" : "обеих"} аргумент${typeof a !== "number" && typeof b !== "number" ? "ах" : "е"} components!`;
  }
  if (a < 0 || a >= 5) {
    return "Вы ввели значение меньше 0 или больше 4 в первом аргументе components!";
  }
  if (b !== undefined && (b < 0 || b >= 5)) {
    return "Вы ввели значение меньше 0 или больше 4 в втором аргументе components!";
  }

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
    new Log({ text: message, type: "error", categories: ["global", "typeError"], logs: false });
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
    new Log({ text: message, type: "error", categories: ["global", "typeError"], logs: false });
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
  EmiliaTypeError,
  EmiliaError,
  prefix,
  GUILD_PERMISSIONS
};
