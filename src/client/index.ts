import { Abstract } from '@constants';
import { Client, Collection, type ClientOptions } from 'discord.js';
import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();
export class EmiliaClient extends Client {
  /**
   * @type {Collection<string, Abstract.AbstractBaseCommand>} - The collection of commands
   */
  public command: Collection<string, Abstract.AbstractBaseCommand> = new Collection();
  /**
   * @type {Collection<string, Abstract.AbstractBaseCommand>} - The collection of Slash commands
   */
  public slashCommand: Collection<string, Abstract.AbstractBaseCommand> = new Collection();
  /**
   * @type {Collection<string, string>} - The collection of events
   */
  public events: Collection<string, string> = new Collection();

  /**
   * @type {PrismaClient} - The client for Prisma. This is the client that will be used to communicate with the database.
   * @see {@link https://www.prisma.io/docs/orm/prisma-client Prisma Client} - for more information. Official documentation.
   */
  public prisma: PrismaClient = db;
  /**
   * Creates an instance of EmiliaClient.
   *
   * @param {ClientOptions} options - The options for the Discord client.
   */
  public constructor(options: ClientOptions) {
    super(options);
  }

  public build(): void {
    console.log('Building client...');
  };
}