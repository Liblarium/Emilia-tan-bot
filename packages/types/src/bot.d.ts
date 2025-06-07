import type {
  ChatInputCommandInteraction,
  Client,
  Collection,
  EmbedBuilder,
  Message,
  SlashCommandBuilder,
} from "discord.js";

export interface ClientBot extends Client {
  /**
   * Commands
   */
  commands: Collection<string, object>;
  /**
   * Events
   */
  events: Set<string>;
}

export type CommandType = "command" | "slash" | "both";

export interface HelpCommandOptions {
  category: string;
  shortDescription: string;
  extendedDescription: string;
  hidden?: boolean;
  usage: string;
  examples: string[];
}

export interface Command {
  handleMessage?: (message: Message) => EmbedBuilder | null;
  handleInteraction?: (
    interaction: ChatInputCommandInteraction,
  ) => EmbedBuilder | null;
}

export type CommandDecoratorOptions = MessageCommand | SlashOrBothCommand;

interface CommandOptions {
  helpOptions?: HelpCommandOptions;
  delete?: boolean;
}

interface SlashOrBothCommand extends CommandOptions {
  commandType: "slash" | "both";
  description: string;
  data: SlashCommandBuilder;
}

interface MessageCommand extends CommandOptions {
  commandType: "command";
  description?: undefined;
  data?: undefined;
}
