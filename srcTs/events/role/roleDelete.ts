import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import {
  EventActions,
  GuildLogsIntents,
  getGuildLogSettingFromDB,
  hexToDecimal,
} from "@util/s";
import type { Role } from "discord.js";

export default class RoleDelete extends BaseEvent {
  constructor() {
    super({
      name: "roleDelete",
      category: "bot",
    });
  }

  async execute(role: Role, client: EmiliaClient) {
    const channel = await getGuildLogSettingFromDB({
      guildId: role.guild.id,
      intents: GuildLogsIntents.ROLE & EventActions.DELETE,
      select: { role: true },
      messageType: "delete",
      message: role,
    });

    if (!channel) return;

    channel.send({
      embeds: [{
        title: "Удаление роли",
        description: `Была удалена роль ${role.name} (${role.id})`,
        color: hexToDecimal("#ff2500"),
        timestamp: new Date().toISOString(),
      }]
    });
  }
}
