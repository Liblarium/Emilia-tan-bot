import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { getXp } from "@util/commands/xp";
import { isGuildMember } from "@util/s";
import type { Message } from "discord.js";

export default class Xp extends BaseCommand<"command"> {
  constructor() {
    super({
      name: "xp",
      commandType: "command",
      //description: "Показывает текущий опыт пользователя.",
      option: {
        aliases: ["exp", "опыт"],
        delete: true
      }
    });
  }

  async execute(message: Message, args: string[], commandName: string, client: EmiliaClient) {
    if (!message.guild || !isGuildMember(message.member) || message.channel.isDMBased()) return;

    const member = message.mentions.members?.first() || message.guild.members.cache.get(args[0]) || message.member;

    const xpMessage = await getXp({ id: member.user.id, guildId: message.guild.id, color: member.displayColor, isYou: message.member.user.id === member.user.id });

    return message.channel.send({ embeds: [xpMessage] });
  }
}
