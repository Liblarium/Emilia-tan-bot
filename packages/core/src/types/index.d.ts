import type { SlashCommandBuilder } from "discord.js";
import type { InjectionToken } from "tsyringe";

/**
 * Represents a class constructor
 */
export  type Constructor<T> = new (...args: unknown[]) => T;

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

/**
 * Type for the options object passed to the Module decorator
 */
export type ModuleServices = {
  /**
   * The service class to register
   */
  service: ServiceRegistration;
  /**
   * The scope of the service
   *
   * - "singleton": The service will be registered as a singleton in the container
   * - "transient": The service will be registered as a transient in the container
   *
   * @default "singleton"
   */
  scope?: "singleton" | "transient";
};

/**
 * Type for the service registration
 */
export type ServiceRegistration = {
  /**
   * The token representing the service
   *
   * If not provided, decorator use provider class as token
   */
  token?: InjectionToken<unknown>;
  /**
   * The service class
   */
  provider: Constructor<unknown>;
};

/**
 * Type for the options object passed to the Module decorator
 */
export type ModuleOptions = {
  /**
   * The modules to import
   */
  imports?: InjectionToken<unknown>[];
  /**
   * The services to register
   *
   * Each service is an object with the following properties:
   * - {Constructor<unknown>} service: The service class to register
   * - {"singleton" | "transient"} scope (optional): The scope of the service
   */
  services?: ModuleServices[];
  /**
   * Register the module in the container
   */
  registerModule?: boolean;
  /**
   * Enable debug mode
   *
   * If true, the decorator will print logs (only) to the console
   *
   * @default false
   */
  debug?: boolean;
};

export type FullInjectionToken<T = unknown> = 
  | InjectionToken<T>
  | Constructor<T>
  | string
  | symbol;