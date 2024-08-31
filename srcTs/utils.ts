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

const GUILD_PERMISSIONS = { //guild logs
  CREATE: 1 << 0, // 1
  DELETE: 1 << 1, // 2
  UPDATE: 1 << 2, // 4
  JOIN: 1 << 3, // 8
  LEAVE: 1 << 4, // 16
};

const time = (): string => {
  const date = new Date();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");
  return `${hour}:${minute}:${second}`;
};

const logTime = (): string => {
  const date = new Date();
  const millisecond = date.getMilliseconds().toString().padStart(3, "0");
  return `${time()}:${millisecond}`;
};

const date = (): string => {
  const date = new Date();
  const data = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${data}.${month}.${year}`;
};

const dateAndTime = (): string => `[${date()}][${logTime()}]`;

/**
 * Функция для убирания переноса строки
 * @param text входящий текст
 * @returns исходящий текст без переносов
 */
const offNewLine = (text: string): string => {
  const newLinePattern = /\r?\n$/;
  const line = text.toString();

  if (line.endsWith("\n") || newLinePattern.test(line))
    return line.slice(0, -2);

  return line;
};

/**
 * @param obj
 * @returns
 */
const isClass = (obj: unknown): boolean =>
  typeof obj === "function" && /^\s*class\s+/.test(obj.toString());

interface isReplyOptions {
  interaction: RepliableInteraction;
  message: InteractionReplyOptions;
}
/**
 * Мини-фунция ответа, дабы можно делать return reply без указания undefined в типах базовом классе евента/команды
 * @param options
 * @param options.interaction
 * @param options.message
 * @returns
 */
const isReply = async ({
  interaction,
  message,
}: isReplyOptions): Promise<void> => {
  await interaction.reply({ ...message });
};

interface isModalOptions {
  interaction: MessageComponentInteraction | ChatInputCommandInteraction;
  modal: ModalComponentData;
}
/**
 * Мини-функция для вызова модального окна, дабы не писать каждый раз showModal
 * @param options
 * @param options.interaction
 * @param options.modal
 * @returns
 */
const isModal = async ({
  interaction,
  modal,
}: isModalOptions): Promise<void> => {
  await interaction.showModal(modal);
};

interface isComponentsOptions {
  interaction: MessageComponentInteraction;
  components: { a?: number; b?: number };
}
/**
 * @param componentOptions
 * @param componentOptions.interaction
 * @param componentOptions.components
 * @returns
 */
function isComponents({
  interaction,
  components = { a: 0 },
}: isComponentsOptions):
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

const log = (message?: unknown, ...optionalParams: unknown[]): void => {
  console.log(`[${time()}][Эмилия-тян | Info]:`, message, ...optionalParams);
};

const error = (message?: unknown, ...optionalParams: unknown[]): void => {
  console.error(`[${time()}][Эмилия-тян | Error]:`, message, ...optionalParams);
};

class EmiliaTypeError extends TypeError {
  constructor(message?: string) {
    super(message);
    this.name = `[${time()} | Emilia | TypeError]`;
  }
}

class EmiliaError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = `[${time()} | Emilia | Error]`;
  }
}

/**
 * Функция рандома для выдачи чисел от min до max (включительно)
 * @param min мин
 * @param max макс
 * @returns
 */
const random = (min: number, max: number): number => {
  if (min >= max)
    throw new EmiliaTypeError(
      `Агрумент min (${min.toString()}) не может быть больше или равно аргументу max (${max.toString()})!`,
    );
  const random = Math.floor(Math.random() * (max - min + 1)) + min;

  return random > max ? random - 1 : random;
};

const prefix = "++";

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
