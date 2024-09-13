import type { Log } from "@log";
import type { ArrayMaybeEmpty } from "@type";
import type { EmiliaError, EmiliaTypeError } from "@util/s";
import type {
  ChatInputCommandInteraction,
  InteractionResponse,
  Message,
  SlashCommandBuilder
} from "discord.js";

interface TypeCommand {
  type: "command" | "slash";
}
interface DeleteCommandMessage {
  delete?: boolean;
}
interface BaseCommandOptions {
  aliases: ArrayMaybeEmpty<string>;
  developer: boolean;
  perms: number;
  test: boolean;
  testers: ArrayMaybeEmpty<string>;
  owner: boolean;
  guilds: ArrayMaybeEmpty<string>;
  channels: ArrayMaybeEmpty<string>;
  dUsers: ArrayMaybeEmpty<string>;
}
type CommandConstructorOptions = Partial<BaseCommandOptions> &
  TypeCommand &
  DeleteCommandMessage;
export type CommandClassOptions = BaseCommandOptions &
  TypeCommand &
  DeleteCommandMessage;
export interface CommandOptions {
  name: string;
  option: CommandConstructorOptions;
  description?: string;
}

export type ExecuteReturns = void | Message | ChatInputCommandInteraction | InteractionResponse | Log | EmiliaError | EmiliaTypeError;

export interface IBaseCommand {
  data: SlashCommandBuilder;
  name: string;
  option: CommandClassOptions;
  execute: (
    ...args: unknown[]
  ) => ExecuteReturns | Promise<ExecuteReturns>;
}
