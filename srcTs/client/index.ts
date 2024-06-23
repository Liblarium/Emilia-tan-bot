import { Client, ClientOptions, Collection } from "discord.js";
import { IEmiliaClient } from "../../types/client";
import { ConnectionInfo } from "../database/typeorm";
import { CommandHandler } from "../handlers/command";
//import { MongoConnect } from "../database/mongo";
import { EventHandler } from "../handlers/event";
import { BaseCommand } from "../base/command";
import { config } from "dotenv";

config();

export class EmiliaClient extends Client implements IEmiliaClient {
  events: Collection<string, string> = new Collection();
  commands: Collection<string, BaseCommand> = new Collection();
  slashCommands: Collection<string, BaseCommand> = new Collection();
  database: ConnectionInfo = new ConnectionInfo();

  constructor(options: ClientOptions) {
    super(options);
    //new MongoConnect();
    new EventHandler(this);
    new CommandHandler(this);
  }
}

const emilia = new EmiliaClient({ intents: 131_071 });
emilia.login(process.env.TOKEN);

export const сonnectionInfo = emilia.database;
