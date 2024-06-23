import { ActionRow, AnyComponent, ChatInputCommandInteraction, InteractionReplyOptions, MessageActionRowComponent, MessageComponentInteraction, ModalComponentData, RepliableInteraction } from "discord.js";

const time = (): string => {
  const date = new Date();
  const hour = date.getHours().toString().padStart(2, `0`);
  const minute = date.getMinutes().toString().padStart(2, `0`);
  const second = date.getSeconds().toString().padStart(2, `0`);
  return `${hour}:${minute}:${second}`;
};

const logTime = (): string => {
  const date = new Date();
  const millisecond = date.getMilliseconds().toString().padStart(3, `0`);
  return `${time()}:${millisecond}`;
};

const date = (): string => {
  const date = new Date();
  const data = date.getDate().toString().padStart(2, `0`);
  const month = (date.getMonth() + 1).toString().padStart(2, `0`);
  const year = date.getFullYear().toString();
  return `${data}.${month}.${year}`;
};

const dateAndTime = (): string => `[${date()}][${logTime()}]`;

/**
 * Функция для убирания переноса строки
 * @param {string} text входящий текст
 * @returns {string} исходящий текст без переносов
 */
const offNewLine = (text: string): string => {
  const newLinePattern = /\r?\n$/;
  const line = text.toString();

  if (line.endsWith(`\n`) || newLinePattern.test(line)) return line.slice(0, -2);

  return line;
};

/**
 * @param {any} obj
 * @returns {boolean}
 */
const isClass = (obj: any): boolean => typeof obj === `function` && /^\s*class\s+/.test(obj.toString());

type isReplyOptions = { interaction: RepliableInteraction; message: InteractionReplyOptions };
/**
 * Мини-фунция ответа, дабы можно делать return reply без указания undefined в типах базовом классе евента/команды
 * @param {object} options
 * @param {RepliableInteraction} options.interaction
 * @param {InteractionReplyOptions} options.message
 * @returns {Promise<void>}
 */
const isReply = async ({ interaction, message }: isReplyOptions): Promise<void> => {
  await interaction.reply({ ...message });
};

type isModalOptions = { interaction: MessageComponentInteraction | ChatInputCommandInteraction; modal: ModalComponentData };
/**
 * Мини-функция для вызова модального окна, дабы не писать каждый раз showModal
 * @param {object} options
 * @param {MessageComponentInteraction | ChatInputCommandInteraction} options.interaction
 * @param {ModalComponentData} options.modal
 * @returns {Promise<void>}
 */
const isModal = async ({ interaction, modal }: isModalOptions): Promise<void> => {
  await interaction.showModal(modal);
};

type isComponentsOptions = { interaction: MessageComponentInteraction; components: { a?: number; b?: number } };
/**
 * @param {object} componentOptions
 * @param {MessageComponentInteraction} componentOptions.interaction
 * @param {{ a?: number, b?: number }} componentOptions.components
 * @returns {AnyComponent | ActionRow<MessageActionRowComponent> | string}
 */
function isComponents({ interaction, components = { a: 0 } }: isComponentsOptions): AnyComponent | ActionRow<MessageActionRowComponent> | string {
  if (!interaction) return `Переменная interaction обязательная!`;

  const comps = interaction.message.components;
  const { a, b } = components;

  if (typeof a != `number` || typeof b != `number`) return `Вы ввели не числовое значение в ${typeof a == `number` ? `первом` : typeof b == `number` ? `втором` : `обеих`} аргумент${typeof a != `number` && typeof b != `number` ? `ах` : `е`} components!`;
  if (a <= -1 || a >= 5) return `Вы ввели значение меньше 0 или больше 4 в первом аргументе components!`;
  if ((b && b <= -1) || b >= 5) return `Вы ввели значение меньше 0 или больше 4 в втором агрументе components!`;

  return b ? comps[a].components[b].data : comps[a];
}

const log = (message?: any, ...optionalParams: any[]): void => console.log(`[${time()}][Эмилия-тян | Info]:`, message, ...optionalParams);

const error = (message?: any, ...optionalParams: any[]): void => console.error(`[${time()}][Эмилия-тян | Error]:`, message, ...optionalParams);

class EmiliaTypeError extends TypeError {
  /** @param {string} [message] */
  constructor(message?: string) {
    super(message);
    this.name = `[${time()} | Emilia | TypeError]`;
  }
}

class EmiliaError extends Error {
  /** @param {string} [message] */
  constructor(message?: string) {
    super(message);
    this.name = `[${time()} | Emilia | Error]`;
  }
}

/**
 * Функция рандома для выдачи чисел от min до max (включительно)
 * @param {number} min мин
 * @param {number} max макс
 * @returns {number}
 */
const random = (min: number, max: number): number => {
  if (min >= max) throw new EmiliaTypeError(`Агрумент min (${min}) не может быть больше или равно аргументу max (${max})!`);
  const random = Math.floor(Math.random() * ((max - min) + 1)) + min;

  return random > max ? random - 1 : random;
}

const prefix = `++`;

export { time, logTime, date, dateAndTime, offNewLine, isClass, isReply, isModal, isComponents, log, error, random, EmiliaTypeError, EmiliaError, prefix };
