import 'dotenv/config';
import type { BaseCommand } from "@base/command";
import { db } from "@database";
import { CommandHandler } from "@handlers/command";
import { EventHandler } from "@handlers/event";
import type { IEmiliaClient } from "@type/client";
import { Client, type ClientOptions, Collection } from "discord.js";
//import { Redis } from "ioredis";

export class EmiliaClient extends Client implements IEmiliaClient {
  events = new Collection<string, string>();
  commands = new Collection<string, BaseCommand>();
  slashCommands = new Collection<string, BaseCommand>();
  // redis: Redis = new Redis();
  database = db;


  constructor(options: ClientOptions) {
    super(options);
    new EventHandler(this);
    new CommandHandler(this);
  }
}

const emilia = new EmiliaClient({ intents: 131_071 });
emilia.login(process.env.TOKEN).catch((e: unknown) => { console.error(e); });

export const { /*redis,*/ database } = emilia;
