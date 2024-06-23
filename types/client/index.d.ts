import { Collection } from "discord.js";
import { BaseCommand } from "../../srcTs/base/command";

export interface IEmiliaClient {
  events: Collection<string, string>;
  commands: Collection<string, BaseCommand>;
  slashCommands: Collection<string, BaseCommand>;
}
