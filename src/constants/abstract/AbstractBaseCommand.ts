import { CommandArguments, CommandOptions } from "@type/constants/command";
import { AbstractAction } from "../abstract/AbstractAction";
import { SlashCommandBuilder } from "discord.js";

export abstract class AbstractBaseCommand extends AbstractAction {
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
   */
  constructor({ name, description, option = {} }: CommandArguments) {
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
  }
}

