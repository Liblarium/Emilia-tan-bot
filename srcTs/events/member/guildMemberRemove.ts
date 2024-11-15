import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import {
  EventActions,
  GuildLogsIntents,
  getGuildLogSettingFromDB,
  hexToDecimal,
} from "@util/s";
import type { GuildMember } from "discord.js";

export default class GuildMemberRemove extends BaseEvent {
  constructor() {
    super({ name: "guildMemberRemove", category: "bot" });
  }
  async execute(member: GuildMember, client: EmiliaClient) {
    if (!member.guild || !member.user.bot) return;

    const channel = await getGuildLogSettingFromDB({
      guildId: member.guild.id,
      select: { member: true },
      intents: GuildLogsIntents.GUILD_MEMBER | EventActions.LEAVE,
      messageType: "leave",
      message: member,
    });

    if (!channel) return; //Мне не зачем включать логи, если они выключены или не были добавлены в интенты

    await channel.send({
      embeds: [
        {
          title: "Пользователь покинул сервер",
          color: hexToDecimal("#ff2500"),
          description: `${member} (${member.user.username} |${member.user.id})`,
          thumbnail: { url: member.user.displayAvatarURL() },
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }
}
