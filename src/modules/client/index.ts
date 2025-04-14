import type { AbstractBaseCommand } from "@abstract/AbstractBaseCommand";
import type { CommandType } from "@enum/command";
import { PrismaClient } from "@prisma/client";
import { Client, type ClientOptions, Collection } from 'discord.js';

export const db = new PrismaClient();
export class EmiliaClient extends Client {
  /**
   * @type {Collection<string, AbstractBaseCommand>} - The collection of commands
   */
  public command: Collection<string, AbstractBaseCommand<string>> = new Collection();
  /**
   * @type {Collection<string, AbstractBaseCommand>} - The collection of Slash commands
   */
  public slashCommand: Collection<string, AbstractBaseCommand<string>> = new Collection();
  /**
   * @type {Collection<string, string>} - The collection of events
   */
  public events: Collection<string, string> = new Collection();

  /**
   * @type {PrismaClient} - The client for Prisma. This is the client that will be used to communicate with the database.
   * @see {@link https://www.prisma.io/docs/orm/prisma-client Prisma Client} - for more information. Official documentation.
   */
  public prisma: PrismaClient = db;

  constructor(options: ClientOptions) {
    super(options);
  }

  /**
   * Checks if the user is a developer. A developer is a user with a specific ID.
   * @param userId - The ID of the user to check.
   * @returns Whether the user is a developer.
   */
  public isDeveloper(userId: string): boolean {
    return userId === "211144644891901952";
  }

  /**
   * Returns an array of all commands of a specific type.
   * @param type - The type of commands to return.
   * @returns An array of all commands of the specified type (command | slash | both).
   */
  public getCommandsByType(type: CommandType): AbstractBaseCommand<string>[] {
    const commands = new Set<AbstractBaseCommand<string>>();
    const aliasMap = new Map<string, string>();

    // Adding all aliases to the map
    for (const command of this.command.values()) {
      // If command not have aliases - skipped
      if (command.aliases.length === 0) continue;

      // Adding all aliases
      for (const alias of command.aliases) {
        aliasMap.set(alias, command.name);
      }
    }

    // Adding all command to the set (if is not aliases)
    for (const command of this.command.values()) {
      if (command.type === type) {
        // If this command name is an alias of another command - skipped
        if (aliasMap.has(command.name)) continue;

        commands.add(command);
      }
    }

    // Adding all slash command to the set
    for (const slashCommand of this.slashCommand.values()) {
      if (slashCommand.type === type) {
        commands.add(slashCommand);
      }
    }

    return Array.from(commands);
  }
}