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
 * Base options for command
 */
interface BaseCommandOptions {
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
  /** 
   * If command message should be deleted 
   */
  delete?: boolean;
}

export type CommandType = "command" | "slash";

/**
 * Options for command constructor
 */
type CommandConstructorOptions = Partial<BaseCommandOptions>;

/**
 * Options for command class
 */
export type CommandClassOptions = Partial<BaseCommandOptions>;

/**
 * Options for command
 */
export interface CommandOptions {
  /**
   * Name of command
   */
  name: string;
  /**
   * Aliases for command
   */
  aliases?: ArrayMaybeEmpty<string>;
  /**
   * Type of command. "command" or "slash"
   */
  commandType: CommandType;
  /**
   * Options for command
   */
  option?: CommandConstructorOptions;
  /**
   * Description of command
   */
  description?: string;
}

/**
 * Type of return value of execute function
 */
export type ExecuteReturns = void | Message | ChatInputCommandInteraction | InteractionResponse | Log | EmiliaError | EmiliaTypeError;

