import type { BaseCommand } from "@base/command";
import { CommandHandler } from "@handlers/command";
import { EventHandler } from "@handlers/event";
import { PrismaClient } from "@prisma/client";
import type { IEmiliaClient } from "@type/client";
import { Client, type ClientOptions, Collection } from "discord.js";

const prisma = new PrismaClient();
class EmiliaClient extends Client implements IEmiliaClient {
  events = new Collection<string, string>();
  commands = new Collection<string, BaseCommand>();
  slashCommands = new Collection<string, BaseCommand>();
  db: PrismaClient = prisma;

  constructor(options: ClientOptions) {
    super(options);
    new EventHandler(this);
    new CommandHandler(this);
  }
}

export { prisma as db, EmiliaClient };

const emilia = new EmiliaClient({ intents: 131_071 });
emilia.login(process.env.TOKEN).catch((e: unknown) => { console.error(e); });
