import type { JsonValue } from "@prisma/client/runtime/library";
import type { MessageOrPartialMessage } from "@type/event";
import type {
  APIModalInteractionResponseCallbackData,
  ActionRow,
  AnyComponent,
  ChatInputCommandInteraction,
  Guild,
  GuildEmoji,
  GuildMember,
  InteractionReplyOptions,
  Message,
  MessageActionRowComponent,
  MessageComponentInteraction,
  NewsChannel,
  NonThreadGuildBasedChannel,
  OmitPartialGroupDMChannel,
  PartialMessage,
  PrivateThreadChannel,
  PublicThreadChannel,
  RepliableInteraction,
  Role,
  StageChannel,
  TextChannel,
  VoiceChannel,
  VoiceState
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
declare function parseJsonValue<T>(jsonValue: JsonValue): T;
declare function hexToDecimal(hex: string): number;
declare function displayColor(color: number | string, replacedColor: number | string): number;
declare function isGuildMember(member: unknown): member is GuildMember;
declare function getGuildLogSettingFromDB({
  guildId,
  select,
  messageType,
  intents,
  message,
}: {
  guildId: string;
  select: GuildLogSelect;
  intents: number;
  messageType: logCategories;
  message:
  | OmitPartialGroupDMChannel<MessageOrPartialMessage>
  | GuildMember
  | GuildEmoji
  | Guild
  | Role
  | VoiceState
  | NonThreadGuildBasedChannel
  | MessageOrPartialMessage;
}): Promise<TextChannel | false>;
declare function clipMessageLog(message: Message | PartialMessage, limit?: number): string;
declare function logFilterCheck(channel: GuildChannels): boolean;
declare class EmiliaTypeError extends Error { }
declare class EmiliaError extends Error { }

export type GuildChannels = NewsChannel | StageChannel | TextChannel | PublicThreadChannel<boolean> | PrivateThreadChannel | VoiceChannel;

export type GuildLogSelect =
  | {
    message: boolean;
  }
  | {
    channel: boolean;
  }
  | {
    role: boolean;
  }
  | {
    emoji: boolean;
  }
  | {
    member: boolean;
  }
  | {
    guild: boolean;
  }
  | {
    voice: boolean;
  };

export type logCategories = "create" | "delete" | "update" | "join" | "leave";