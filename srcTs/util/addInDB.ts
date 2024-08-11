import { ChannelType, GuildMember, type Interaction, type Message } from "discord.js";
import type { ReadonlyDeep } from "type-fest";
import type { ArrayNotEmpty } from "../../types";
import { Database, missModelError } from "../database";
import { Log } from "../log";

const logCategories: ArrayNotEmpty<string> = ["add_in_db", "utils", "global"];

type MesIntr = ReadonlyDeep<Message | Interaction>;

export class AddInDB {
  constructor(message: MesIntr) {
    this.build(message).catch((e: ReadonlyDeep<unknown>) => { console.error(e); });
  }

  private async build(message: MesIntr): Promise<undefined | Log> {
    if (message.channel?.type === ChannelType.DM || !message.guildId || !message.guild) return;

    const guildId = message.guildId;
    const db = new Database();
    const guilddb = await db.findOneBy("guilds", { id: guildId });
    let errrors = 0;

    if (guilddb.error) {
      if (guilddb.error === missModelError) return new Log({ text: missModelError, type: "error", categories: logCategories });

      errrors++;
      const newGuild = await db.create("guilds", { id: guildId, addInBD: ["334418584774246401", "451103537527783455"].includes(guildId) });

      if (newGuild.error) return new Log({ text: newGuild.error, type: "error", categories: logCategories });

      new Log({ text: `Был добавлен новый сервер (| ${message.guild.name} |)[${message.guildId}] в базу данных!`, type: "info", categories: logCategories });

      if (errrors >= 5) throw new TypeError("Смени тип столбца в схеме!");
      return this.build(message);
    }
    if (!guilddb.error) errrors = 0;

    const res = guilddb.res;
    const member = message.member;

    if (!res) return new Log({ text: "Нет guild!", type: "error", categories: logCategories });
    if (!res.addInBD || (member?.user.bot ?? !member)) return;

    if (!(member instanceof GuildMember)) return new Log({ text: "member не member!", type: "error", categories: logCategories });

    const user = await db.findOneOrCreate({
      name: "users", filter: { id: member.user.id }, document: {
        id: member.user.id,
        info: { username: member.user.username },
      }
    });

    if (user.error) return new Log({ text: user.error, type: "error", categories: logCategories });
    if (user.created === true) return new Log({ text: `${member.user.username} был записан в БД!`, type: "info", categories: logCategories });

    const resUser = user.res;

    if (!(resUser != null && user.created === false)) return;
    if (!resUser.info) return new Log({ text: "users.info = undefined", type: "error", categories: logCategories });
    if (member.user.username === resUser.info.username) return;

    const updUsername = await db.update("users", { id: member.user.id }, { info: { username: member.user.username } });

    if (updUsername.error) return new Log({ text: updUsername.error, type: "error", categories: logCategories });

    new Log({ text: `Было обновлено имя ${resUser.info.username} на ${member.user.username} в БД!`, type: "info", categories: logCategories });
  }
}
