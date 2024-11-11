import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import type { GuildLogOption } from "@type";
import { EventActions, GuildLogsIntents, getGuildLogSettingFromDB, hexToDecimal, parseJsonValue, stringToBigInt } from "@util/s";
import { type GuildMember, TextChannel } from "discord.js";

export class GuildMemberAdd extends BaseEvent {
  constructor() {
    super({ name: "guildMemberAdd", category: "bot" });
  }
  async execute(member: GuildMember, client: EmiliaClient) {
    if (!member.guild || !member.user.bot) return;

    const dbGuild = await getGuildLogSettingFromDB(
      stringToBigInt(member.guild.id), { member: true }, GuildLogsIntents.GUILD_MEMBER & EventActions.JOIN);

    if (!dbGuild) return; //Мне не зачем включать логи, если они выключены или не были добавлены в интенты

    const logChannel = parseJsonValue<GuildLogOption>(dbGuild.member);

    if (!logChannel.join || logChannel.join.length <= 17) return; //более вероятно он просто не указан. id имеет длину 

    const channel = member.guild.channels.cache.get(logChannel.join);

    if (!(channel instanceof TextChannel)) return;

    await channel.send({
      embeds: [{
        title: "Новый пользователь",
        color: hexToDecimal("#00ff00"),
        description: `${member} (${member.user.username} |${member.user.id})`,
        thumbnail: { url: member.user.displayAvatarURL() },
        timestamp: new Date().toISOString()
      }]
    });
  }
}
