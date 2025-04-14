import { CommandType } from "@enum/command";
import type {
  ArraySendOptions,
  CommandArguments,
  CommandContext,
  CommandOptions,
  SendOptions,
  TypeOrMode
} from "@type";
import {
  CommandInteraction,
  type InteractionReplyOptions,
  Message,
  type MessageCreateOptions,
  SlashCommandBuilder,
  type User
} from "discord.js";
import { AbstractAction } from "./AbstractAction";
import { emiliaError } from "@utils/error/EmiliaError";
import { ErrorCode } from "@enum/errorCode";
import type { EmiliaClient } from "@client";
import { AbstractEmiliaError } from "./EmiliaAbstractError";
import { LogFactory } from "@log/logFactory";

export abstract class AbstractBaseCommand<T extends string> extends AbstractAction<T> {
  /**
   * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object official Discord API documentation}. If you need more information about Discord API
   *
   * @see {@link https://discord.js.org/docs/packages/discord.js/main/SlashCommandBuilder:Class discord.js SlashCommandBuilder Documentation}. If you need more information about this class
   */
  public readonly data: SlashCommandBuilder = new SlashCommandBuilder();

  /**
   * Cooldowns for the command
   */
  private cooldowns: Map<string, number> = new Map();

  /**
   * Command name
   */
  public readonly name: T;

  /**
   * Command options
   * @see {CommandOptions} interface
   */
  public option: CommandOptions;

  /**
   * Alternative names for the command (Only message commands)
   */
  public aliases: string[] = [];

  /**
   * The command type. Default is CommandType.Both
   */
  public type: CommandType;

  /**
   * Command context
   */
  public context: CommandContext;

  /**
   * Constructor for the AbstractBaseCommand class
   *
   * @param {CommandArguments} options - Command arguments
   * @param {string} options.name - Command name
   * @param {string} options.description - Command description
   * @param {CommandOptions} [options.option={}] - Command options
   * @param {boolean} [options.option.developer=false] - Whether the command is only available to developers
   * @param {boolean} [options.option.test=false] - Whether the command is only available to testers
   * @param {string[]} [options.option.testers=[]] - IDs of users who can use the command in test mode
   * @param {boolean} [options.option.owner=false] - Whether the command is only available to the owner of the bot
   * @param {string[]} [options.option.guilds=[]] - IDs of guilds where the command is available
   * @param {string[]} [options.option.channels=[]] - IDs of channels where the command is available
   * @param {string[]} [options.option.dUsers=[]] - IDs of users who cannot use the command
   * @param {number} [options.option.perms=0] - Permissions required to use the command
   * @param {boolean} [options.option.delete=false] - Whether the command should delete the message it was sent in response to. Only message command
   * @param {Enums.CommandType} [options.type=Enums.CommandType.Both] - The type of the command
   * @param {string[]} [options.aliases=[]] - Alternative names for the command (aliases for message commands)
   */
  constructor({ name, description, option = {}, type, aliases, context }: CommandArguments<T>) {
    if (!name || !description) throw new Error("Command name and description are required!");

    super(name);

    this.name = name;
    this.data
      .setName(name)
      .setDescription(description);

    this.context = context;

    if (!option.help) throw emiliaError("[AbstractBaseCommand.constructor]: Option 'help' is required!", ErrorCode.MISSING_OPTION, "TypeError");

    const help = option.help;

    if (help.extendedDescription.length > 2500 || help.shortDescription.length > 200) throw emiliaError("[AbstractBaseCommand.constructor]: Extended description or short description is too long!", ErrorCode.DESCRIPTION_TOO_LONG, "TypeError");

    // initialize command options
    this.option = {
      developer: option.developer ?? false,
      test: option.test ?? false,
      testers: option.testers ?? [],
      owner: option.owner ?? false,
      guilds: option.guilds ?? [],
      channels: option.channels ?? [],
      dUsers: option.dUsers ?? [],
      perms: option.perms ?? 0,
      delete: option.delete ?? false,
      help
    };

    // If command have aliases. Only message command versions
    if (aliases && aliases.length > 0 && type !== CommandType.Slash) this.aliases = aliases;

    // I have 3 versions of commands (both and only message or slash command)
    this.type = type ?? CommandType.Both;
  }

  /**
   * Checks if the command is a slash command or a command with both types
   * @returns {boolean} Returns `true` if the command is a slash command, `false` otherwise
   */
  public isSlash(): boolean {
    return this.type === CommandType.Slash || this.type === CommandType.Both;
  }

  /**
   * Checks if the command is a message command or a command with both types
   * @returns {boolean} Returns `true` if the command is a message command, `false` otherwise
   */
  public isMessage(): boolean {
    return this.type === CommandType.Command || this.type === CommandType.Both;
  }

  /**
 * Sends a message or reply based on the command type and provided options.
 *
 * @param options - The options for the message (content, embeds, etc.).
 * @param typeOrMode - The command type or specific modes for each type.
 *                     If a `CommandType` is provided, it determines which type to send to.
 *                     If an object is provided, it specifies the mode for each type.
 *                     Example: `{ slash: "reply", message: "send" }`.
 *                      
 *                     If you want to send message/slash (one) - use .reply)
 * @param withResponse - If true - send ephemeral (slash) message. Only reply options 
 * @returns A promise that resolves when the message is sent.
 * @example
 * this.send({ content: "Hello, world!" }, CommandType.Slash); // Send a reply to a slash command
 * this.send({ content: "Hello, world!" }, CommandType.Command); // Send a message to a message command
 */
  protected async send(
    options: SendOptions | ArraySendOptions,
    typeOrMode: TypeOrMode,
    withResponse?: boolean
  ): Promise<unknown> {
    const isArray = Array.isArray(options);

    if (isArray && options.length !== 2) throw emiliaError(`[AbstractBaseCommand.send]: Options must be an array of length 2! Your array: ${options.toString()} (length: ${options.length})`, ErrorCode.INVALID_ARRAY_LENGTH, "TypeError");

    // Determine the mode for each command type
    const mode = {
      slash: typeOrMode === CommandType.Both ? "reply" : typeOrMode.slash,
      message: typeOrMode === CommandType.Both ? "reply" : typeOrMode.message
    };

    // Handle Slash commands
    if (this.isSlash() && this.context instanceof CommandInteraction) {
      const interaction = this.context;

      if (mode.slash === "reply") {
        const option: InteractionReplyOptions = isArray ? options[0] : options;

        return await interaction.reply({ ...option, withResponse });
      }

      throw new Error("Slash commands do not support 'send' mode.");
    }

    // Handle Message commands
    if (this.isMessage() && this.context instanceof Message) {
      const message = this.context;
      const option: MessageCreateOptions = isArray ? options[1] : options;

      if (mode.message === "reply") return message.reply(option);
      if (mode.message === "send") {
        // If the message is a DM, do not send it
        if (message.channel.isDMBased()) return;

        return message.channel.send(option);
      }
    }

    throw new Error("Invalid command type or context.");
  }

  /**
   * Checks if the command is available for the given context and client.
   * 
   * This function will return false if any of the following conditions are met:
   * - The command is restricted to `developers` and the user is not a developer.
   * - The command is in `test` mode and the user is not in the list of testers.
   * - The command is restricted to the `owner` of the guild and the user is not the owner.
   * - The command is restricted to specific `guilds` and the guild is not in the list.
   * - The command is restricted to specific `channels` and the channel is not in the list.
   * - The command is restricted to specific `users` and the user is in the list.
   * 
   * Otherwise, it will return true.
   * 
   * @param context - The context of the command (Message or CommandInteraction).
   * @param client - The EmiliaClient instance handling the command.
   * @returns A boolean indicating whether the command is available.
   */
  protected isCommandAvailable(context: CommandContext, client: EmiliaClient): boolean {
    const { developer, test, testers, owner, guilds, channels, dUsers } = this.option;
    const user = this.user;

    if (developer) return client.isDeveloper(user?.id ?? "");
    if (test && testers && testers.length > 0) return !testers.includes(user?.id ?? "");
    if (owner) return context.guild?.ownerId === (user?.id ?? "");
    if (guilds && guilds.length > 0) return guilds.includes(context.guild?.id ?? "");
    if (channels && channels.length > 0) return channels.includes(context.channel?.id ?? "");
    if (dUsers && dUsers.length > 0) return !dUsers.includes(user?.id ?? "");

    return true;
  }

  /**
   * Gets the User object associated with the command context.
   * 
   * This property will return the User object associated with the command context,
   * or undefined if the context does not have a user.
   * 
   * @readonly
   */
  public get user(): User | undefined {
    return this.context instanceof Message ? this.context.member?.user : this.context.user;
  }
  /**
   * Logs an error that occurs during command execution.
   * 
   * This method uses the LogFactory to log details about the error, including the error message,
   * type, categories, tags, metadata, and context information. It also determines the error code
   * based on whether the error is an instance of AbstractEmiliaError.
   * 
   * @param error - The error object or message encountered during command execution.
   * @param context - The context in which the error occurred, providing information about the user,
   * guild, and channel involved in the command execution.
   */
  protected handleError(error: unknown, context: CommandContext): void {
    LogFactory.log({
      text: error,
      type: 2,
      categories: ["command", "execution"],
      tags: ["command", this.name],
      metadata: { error },
      context: { user: this.user?.id, guild: context.guild?.id, channel: context.channel?.id },
      code: error instanceof AbstractEmiliaError ? error.code : ErrorCode.UNKNOWN_ERROR,
    });
  }
  protected logExecution(context: CommandContext): void {
    LogFactory.log({
      text: `Command executed: ${this.name}`,
      type: 1,
      categories: ["command", "execution"],
      tags: ["command", this.name],
      code: ErrorCode.OK,
      metadata: { user: this.user?.id, guild: context.guild?.id, channel: context.channel?.id },
    });
  }

  /**
   * Checks if a user is currently on cooldown for using the command.
   * 
   * This method determines if the specified user is on cooldown for the command execution.
   * It returns true if the user is on cooldown, otherwise false. If the user is not on cooldown,
   * the method will set a new cooldown period for the user.
   * 
   * @param userId - The ID of the user to check the cooldown status for.
   * @returns A boolean indicating whether the user is on cooldown (true) or not (false).
   */
  protected isOnCooldown(userId: string): boolean {// TODO: I don't know - where use. Nvm.
    const now = Date.now();
    const cooldown = this.cooldowns.get(userId) ?? 0;

    if (now < cooldown) return true;

    this.cooldowns.set(userId, now + (this.option.cooldown ?? 5000)); // 5 seconds by default
    return false;
  }
}

