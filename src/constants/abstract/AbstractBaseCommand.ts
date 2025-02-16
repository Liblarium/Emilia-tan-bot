import { CommandArguments, CommandOptions } from "@type/constants/command";
import { Abstract, Enums } from "@constants";
import { SlashCommandBuilder } from "discord.js";

export abstract class AbstractBaseCommand extends Abstract.AbstractAction {
  /**
   * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object official Discord API documentation}. If you need more information about Discord API
   *
   * @see {@link https://discord.js.org/docs/packages/discord.js/main/SlashCommandBuilder:Class discord.js SlashCommandBuilder Documentation}. If you need more information about this class
   */
  public readonly data: SlashCommandBuilder = new SlashCommandBuilder();

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
  public type: Enums.CommandType;

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
  constructor({ name, description, option = {}, type, aliases }: CommandArguments) {
    super(name);
    this.data
      .setName(name)
      .setDescription(description);

    this.option = {
      developer: option.developer ?? false,
      test: option.test ?? false,
      testers: option.testers ?? [],
      owner: option.owner ?? false,
      guilds: option.guilds ?? [],
      channels: option.channels ?? [],
      dUsers: option.dUsers ?? [],
      perms: option.perms ?? 0,
      delete: option.delete ?? false
    };

    // If command have aliases. Only message command versions
    if (aliases && aliases.length > 0) this.aliases = aliases;

    // I have 3 versions of commands (both and only message or slash command)
    this.type = type ?? Enums.CommandType.Both;
  }
}

