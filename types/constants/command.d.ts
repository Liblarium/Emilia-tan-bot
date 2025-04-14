import type { CommandType } from "@enum/command";
import type { MessageCreateOptions, InteractionReplyOptions, Message, CommandInteraction } from "discord.js";

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

export interface CommandArguments<T extends string> {
  /**
   * Command name
   */
  name: T;
  /**
   * Command options
   */
  option?: CommandOptions;
  /**
   * Command description
   */
  description: string;
  /**
   * Command Aliases (message command only)
   */
  aliases?: string[];
  /**
   * Command type (both, message or slash command)
   * @default CommandType.Both
   */
  type?: CommandType;
  /**
   * Command context. interaction or message.
   */
  context: CommandContext;
}
/**
 * Options for sending a message or reply
 */
export type SendOptions = MessageSendOptions | InteractionSendOptions;
/**
 * Options for sending a message or reply
 */
export type ArraySendOptions = [interaction: InteractionSendOptions, message: MessageSendOptions];
/**
 * Options for replying message
 */
export type InteractionSendOptions = Omit<InteractionReplyOptions, "flags" | "ephemeral" | "withResponse">;
/**
 * Options for sending a message or reply
 */
export type MessageSendOptions = Omit<MessageCreateOptions, "flags">;
/**
 * Reply or send a message
 */
export type ReplyOrSend = "reply" | "send";
/**
 * Command type or specific modes for each type
 * 
 * Use `{ slash: "reply", message: "send" }` or `CommandType.Both`.
 * 
 * If you need only one choice (message/slash) - use .reply from interaction/message
 */
export type TypeOrMode = CommandType.Both | { slash?: ReplyOrSend; message?: ReplyOrSend };

/**
 * Command context
 */
export type CommandContext = CommandInteraction | Message;