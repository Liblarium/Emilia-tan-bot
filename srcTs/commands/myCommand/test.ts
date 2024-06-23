import { GuildMember, Message } from "discord.js";
import { Types } from "mongoose";
import { BaseCommand } from "../../base/command";
import { EmiliaClient } from "../../client";
import { Database } from "../../database";
import { Users } from "../../database/schema/users";
import { ConnectionInfo } from "../../database/typeorm";
import { log } from "../../utils";

const { ObjectId } = Types;

export default class Test extends BaseCommand {
  constructor() {
    super({
      name: `test`,
      option: {
        aliases: [`ts`],
        type: `command`,
        test: true,
        testers: [`357203448640307201`],
        delete: true,
      },
    });
  }

  async execute(message: Message, args: any[], commandName: string, client: EmiliaClient) {
    //const db = this.db;
    const member = message.member as GuildMember;

    message.channel.send({ content: commandName || `ошибка` });
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
