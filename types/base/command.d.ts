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
  /** 
   * If command message should be deleted 
   */
  delete?: boolean;
}

type CommandType = "command" | "slash";

type EditedBaseCommandOptions = Omit<BaseCommandOptions, "aliases" | "perms" | "delete">;

/**
 * Options for command constructor
 */
type CommandConstructorOptions<T extends CommandType = "command"> = T extends "command" ? Partial<BaseCommandOptions> : Partial<EditedBaseCommandOptions>;

/**
 * Options for command class
 */
export type CommandClassOptions<T extends CommandType = "command"> = T extends "command" ? Partial<BaseCommandOptions> : Partial<EditedBaseCommandOptions>;

/**
 * Options for command
 */
export interface CommandOptions<T extends CommandType = "command"> {
  /**
   * Name of command
   */
  name: string;
  /**
   * Options for command
   */
  option?: CommandConstructorOptions;
  /**
   * Description of command
   */
  description?: T extends "command" ? undefined : string;
}

/**
 * Type of return value of execute function
 */
export type ExecuteReturns = void | Message | ChatInputCommandInteraction | InteractionResponse | Log | EmiliaError | EmiliaTypeError;

