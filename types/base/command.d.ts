import type { Log } from "@log";
import type { ArrayMaybeEmpty } from "@type";
import type {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";

//import { Database } from "../../srcTs/database";

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

export interface IBaseCommand {
  data: SlashCommandBuilder;
  name: string;
  option: CommandClassOptions;
  //db: Database;

  execute: (
    ...args: unknown[]
  ) =>
    | void
    | Message
    | ChatInputCommandInteraction
    | Log
    | Promise<void | Message | ChatInputCommandInteraction | Log>;
}
