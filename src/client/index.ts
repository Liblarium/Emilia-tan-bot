import type { Abstract } from '@constants';
import { PrismaClient } from "@prisma/client";
import { Client, type ClientOptions, Collection } from 'discord.js';

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

  constructor(options: ClientOptions) {
    super(options);
  }

  public build(): void {
    console.log('Building client...');
  };
}