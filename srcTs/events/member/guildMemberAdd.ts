import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import { EventActions, GuildLogsIntents, getGuildLogSettingFromDB, hexToDecimal } from "@util/s";
import type { GuildMember } from "discord.js";

export default class GuildMemberAdd extends BaseEvent {
  constructor() {
    super({ name: "guildMemberAdd", category: "bot" });
  }
  async execute(member: GuildMember, client: EmiliaClient) {
    if (!member.guild || !member.user.bot) return;

    const channel = await getGuildLogSettingFromDB({
      guildId: member.guild.id,
      select: { member: true },
      intents: GuildLogsIntents.GUILD_MEMBER | EventActions.JOIN,
      messageType: "join",
      message: member
    });

    if (!channel) return;

    await channel.send({
      embeds: [
        {
          title: "Новый пользователь",
          color: hexToDecimal("#00ff00"),
          description: `${member} (${member.user.username} |${member.user.id})`,
          thumbnail: { url: member.user.displayAvatarURL() },
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }
}
