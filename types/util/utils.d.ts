import type {
  ActionRow,
  AnyComponent,
  ChatInputCommandInteraction,
  InteractionReplyOptions,
  MessageActionRowComponent,
  MessageComponentInteraction,
  ModalComponentData,
  RepliableInteraction,
} from "discord.js";

declare const prefix: string;
declare const GUILD_PERMISSIONS: {
  CREATE: number;
  DELETE: number;
  UPDATE: number;
  JOIN: number;
  LEAVE: number;
};


declare function time(): string;
declare function logTime(): string;
declare function date(): string;
declare function dateAndTime(): string;
declare function offNewLine(text: string): void;
declare function isClass(value: unknown): boolean;
declare function isReply({ interaction, message }: { interaction: RepliableInteraction, message: InteractionReplyOptions }): boolean;
declare function isModal({ interaction, modal }: { interaction: MessageComponentInteraction | ChatInputCommandInteraction, modal: ModalComponentData }): boolean;
declare function isComponents({
  interaction,
  components = { a: 0 },
}: { interaction: MessageComponentInteraction, components: { a: number, b?: number } }): boolean;
declare function log(message?: unknown, ...optionalParams: unknown[]): void;
declare function error(message?: unknown, ...optionalParams: unknown[]): void;
declare function random(min: number, max: number): number;
declare function stringToBigInt(str: string): bigint;
declare class EmiliaTypeError extends Error { }
declare class EmiliaError extends Error { }