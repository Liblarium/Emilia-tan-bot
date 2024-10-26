import type { BaseCommand } from "@base/command";
import type { PrismaClient } from "@prisma/client";
import type { Collection } from "discord.js";

/**
 * Interface for the Emilia client class
 * @interface
 * @property {Collection<string, string>} events - Collection of events
 * @property {Collection<string, BaseCommand>} commands - Collection of commands
 * @property {Collection<string, BaseCommand>} slashCommands - Collection of slash commands
 * @property {PrismaClient} db - Prisma client
 */
export interface IEmiliaClient {
  events: Collection<string, string>;
  commands: Collection<string, BaseCommand>;
  slashCommands: Collection<string, BaseCommand>;
  db: PrismaClient;
}
