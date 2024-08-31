import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import { Log } from "@log";
import { ChannelType, type Message /*, PermissionsBitField */ } from "discord.js";
//import { AddInDB } from "@util/addInDB"; 
import { CommandHandler } from "./messageComponents/command.handler";

//const { Flags: { SendMessages } } = PermissionsBitField;

export default class MessageCreate extends BaseEvent {
  constructor() {
    super({ name: "messageCreate", category: "bot" });
  }

  execute(message: Message, client: EmiliaClient): undefined {
    //new AddInDB(message);
    //const db = this.db;
    //const logMessage: LogOptions = { text: ``, type: 1, event: true, categories: [`global`, `command`] /*, db: true*/ };
    /*if (message.content === `add`) {
      const guild = await db.fetchData(`id`, message.guild?.id, `guild_setting`);
        if (guild.res === null) {
        const newGuild = await db.upsertData({ id: message.guild?.id, setting: { prefix: "++", def_prefix: "++", add_in_db: true, cmd: 5, logs: 0, ranks: true, rank: { random: { min: 0, max: 15, }, xp_max: 300, interval_xp: 0, next_xp: 0, message: { global: false, global_id: "", global_text: "", local: false, local_id: "", local_text: "" } } } }, `guild_setting`);
          console.log(newGuild);
      }
    }*/
    if (message.channel.type !== ChannelType.DM) {
      try {
        new CommandHandler(message, client);
      } catch (e: unknown) {
        new Log({ text: e as Error, type: "error", event: true, categories: ["global", "command"] });
      }
    }
  }
}
