import { Client, type ClientOptions, Collection } from "discord.js";
import { config } from "dotenv";
import type { IEmiliaClient } from "../../types/client";
import type { BaseCommand } from "../base/command";
//import { ConnectionInfo } from "../database/typeorm";
import { CommandHandler } from "../handlers/command";
import { EventHandler } from "../handlers/event";

config();

export class EmiliaClient extends Client implements IEmiliaClient {
  events = new Collection<string, string>();
  commands = new Collection<string, BaseCommand>();
  slashCommands = new Collection<string, BaseCommand>();
  //database: ConnectionInfo = new ConnectionInfo();

  constructor(options: ClientOptions) {
    super(options);
    new EventHandler(this);
    new CommandHandler(this);
  }
}

const emilia = new EmiliaClient({ intents: 131_071 });
emilia.login(process.env.TOKEN).catch((e: unknown) => { console.error(e); });

//export const сonnectionInfo = emilia.database;
