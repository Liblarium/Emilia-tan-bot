/**
 * Interface for commands
 */
import type { Log } from "@log";
import type { ArrayMaybeEmpty } from "@type";
import type { EmiliaError, EmiliaTypeError } from "@util/s";
import type {
  ChatInputCommandInteraction,
  InteractionResponse,
  Message,
  SlashCommandBuilder
} from "discord.js";

/**
 * Type of command
 */
interface TypeCommand {
  /** "command" - message command. "slash" - slash command */
  type: "command" | "slash";
}

/**
 * Option for delete command message
 */
interface DeleteCommandMessage {
  /** If command message should be deleted */
  delete?: boolean;
}

/**
 * Base options for command
 */
interface BaseCommandOptions {
  /**
   * Aliases for command
   */
  aliases: ArrayMaybeEmpty<string>;
  /**
   * If command is developer command
   */
  developer: boolean;
  /**
   * Permissions for command
   */
  perms: number;
  /**
   * If command is test command
   */
  test: boolean;
  /**
   * Testers of command
   */
  testers: ArrayMaybeEmpty<string>;
  /**
   * If command is owner command
   */
  owner: boolean;
  /**
   * Guilds where command is available
   */
  guilds: ArrayMaybeEmpty<string>;
  /**
   * Channels where command is available
   */
  channels: ArrayMaybeEmpty<string>;
  /**
   * Users who can't use command
   */
  dUsers: ArrayMaybeEmpty<string>;
}

/**
 * Options for command constructor
 */
type CommandConstructorOptions = Partial<BaseCommandOptions> &
  TypeCommand &
  DeleteCommandMessage;

/**
 * Options for command class
 */
export type CommandClassOptions = BaseCommandOptions &
  TypeCommand &
  DeleteCommandMessage;

/**
 * Options for command
 */
export interface CommandOptions {
  /**
   * Name of command
   */
  name: string;
  /**
   * Options for command
   */
  option: CommandConstructorOptions;
  /**
   * Description of command
   */
  description?: string;
}

/**
 * Type of return value of execute function
 */
export type ExecuteReturns = void | Message | ChatInputCommandInteraction | InteractionResponse | Log | EmiliaError | EmiliaTypeError;

/**
 * Interface for base command
 */
export interface IBaseCommand {
  /**
   * Data of command
   */
  data: SlashCommandBuilder;
  /**
   * Name of command
   */
  name: string;
  /**
   * Options of command
   */
  option: CommandClassOptions;
  /**
   * Function for execute command. Main command function
   */
  execute: (
    ...args: unknown[]
  ) => ExecuteReturns | Promise<ExecuteReturns>;
}


