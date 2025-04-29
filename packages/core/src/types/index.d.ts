import type { SlashCommandBuilder } from "discord.js";

/**
 * Represents a class constructor
 */
export  type Constructor<T> = new (...args: any[]) => T;

export type CommandType = "command" | "slash" | "both";

interface CommandOptions {
  helpOptions: HelpCommandOptions;
  commandOptions: CommandOptions;
}

interface SlashOrBothCommand extends CommandOptions {
  /**
   * Command type - "slash" | "both"
   */
  commandType: Omit<CommandType, "command">;
  /**
   * Command description
   */
  description: string;
  /**
   * He is a slash command data builder
   * 
   * Don't use `.setName` and `.setDescription` - he used by decorator. If need other lang's - use 
   * 
   * @see {@link https://discord.com/developers/docs/interactions/application-commands Application Commands}
   * @see {@link https://discord.com/developers/docs/interactions/application-commands#slash-commands Slash Commands}
   */
  data: SlashCommandBuilder;
}

interface MessageCommand extends CommandOptions {
  /**
   * Command type - "command"
   */
  commandType: "command";
  /**
   * Command description. Only for slash commands. Not have effect for commands
   * 
   * If you need description - use `commandType: "both"` or "slash"
   */
  description: undefined;
  /**
   * Slash command data. Only for slash commands. Not have effect for commands
   * 
   * If you need description - use `commandType: "both"` or "slash"
   */
  data: undefined;
}

export type CommandDecoratorOptions = MessageCommand | SlashOrBothCommand;

// export type CommandDecoratorOptions = {
//   commandType: T;
//   description: T extends Omit<CommandType, "command"> ? string : undefined;
//   data: T extends Omit<CommandType, "command">
//     ? SlashCommandBuilder
//     : undefined;
//   helpOptions: HelpCommandOptions;
//   commandOptions: CommandOptions;
// };

export interface CommandOptions {
  /**
   * Whether to delete the message with the command? (The message itself | command type only)
   */
  delete?: boolean;
  /**
   * Command available only for developers
   */
  developer?: boolean;
  /**
   * Permission level limitations (not Discord permissions)
   */
  perms?: number;
  /**
   * Is the command for testing purposes?
   */
  test?: boolean;
  /**
   * Testers' IDs
   */
  testers?: string[];
  /**
   * Is the command available for server owners?
   */
  owner?: boolean;
  /**
   * Channels where the command will not respond (IDs)
   */
  channels?: string[];
  /**
   * Guilds where the command will not respond (IDs)
   */
  guilds?: string[];
  /**
   * Users from which the command will not respond (IDs)
   */
  dUsers?: string[];
  /**
   * Command cooldown
   */
  cooldown?: number;
  /**
   * Options from the help command
   */
  help?: HelpCommandOptions;
}

export interface HelpCommandOptions {
  /**
   * Command category
   */
  category: string;
  /**
   * Command short description. Used on help list command
   *
   * Max length: 200
   */
  shortDescription: string;
  /**
   * Command extended description. Used on help info command
   *
   * Max length: 2500
   */
  extendedDescription: string;
  /**
   * Hidden command on help list
   */
  hidden?: boolean;
  /**
   * Command usage
   *
   * @example
   * "command | command [arg1] [arg2]"
   */
  usage: string;
  /**
   * Command examples
   *
   * @example
   * ["command [arg1] [arg2]", "command [arg1"]
   */
  examples: string[];
}