import type { BaseCommand } from "@base/command";
import type { Collection } from "discord.js";

export interface IEmiliaClient {
  events: Collection<string, string>;
  commands: Collection<string, BaseCommand>;
  slashCommands: Collection<string, BaseCommand>;
}
