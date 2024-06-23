import { SlashCommandBuilder, Message, ChatInputCommandInteraction } from "discord.js";
import { ArrayMaybeEmpty } from "..";
import { Log } from "../../srcTs/log";

//import { Database } from "../../srcTs/database";

type TypeCommand = { type: "command" | "slash" };
type DeleteCommandMessage = { delete?: boolean };
type BaseCommandOptions = {
  aliases: ArrayMaybeEmpty<string>;
  developer: boolean;
  perms: number;
  test: boolean;
  testers: ArrayMaybeEmpty<string>;
  owner: boolean;
  guilds: ArrayMaybeEmpty<string>;
  channels: ArrayMaybeEmpty<string>;
  dUsers: ArrayMaybeEmpty<string>;
};
type CommandConstructorOptions = Partial<BaseCommandOptions> & TypeCommand & DeleteCommandMessage;
export type CommandClassOptions = BaseCommandOptions & TypeCommand & DeleteCommandMessage;
export type CommandOptions = { name: string; option: CommandConstructorOptions; description?: string };

export interface IBaseCommand {
  data: SlashCommandBuilder;
  name: string;
  option: CommandClassOptions;
  //db: Database;

  execute: (...args: any[]) => void | Message | ChatInputCommandInteraction | Log | Promise<void | Message | ChatInputCommandInteraction | Log>;
}
