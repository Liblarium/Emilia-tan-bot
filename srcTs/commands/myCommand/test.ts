import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import type { Message } from "discord.js";
//import { Database } from "@database";
//import { Users } from "@schema/user";
//import { log } from "@util/s";

export default class Test extends BaseCommand {
  constructor() {
    super({
      name: "test",
      option: {
        aliases: ["ts"],
        type: "command",
        test: true,
        testers: ["357203448640307201"],
        delete: true,
      },
    });
  }

  execute(message: Message, args: string[], commandName: string, client: EmiliaClient): undefined {
    /*const db = this.db;*/
    //const member = message.member;
    message.channel.send({ content: commandName || "ошибка" }).catch((e: unknown) => { console.error(e); });
    // prettier-ignore
    /*const find = await db.create({
      _id: new ObjectId(),
      id: member.user.id,
      username: member.user.username,
    }, `users`);

    log(find);*/
    //message.channel.send({ content: `Пока тут ничего нет` });
    // prettier-ignore
    /*message.channel.send({
      components: [{
        type: 1,
        components: [{
          type: 2,
          customId: `but_test`,
          style: 1,
          label: `test`
        }]
      }]
    });*/
  }
}
