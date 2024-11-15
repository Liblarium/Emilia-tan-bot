import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import {
  EventActions,
  GuildLogsIntents,
  getGuildLogSettingFromDB,
  hexToDecimal,
} from "@util/s";
import type { Role } from "discord.js";

export default class RoleUpdate extends BaseEvent {
  constructor() {
    super({
      name: "roleUpdate",
      category: "bot",
    });
  }

  async execute(oldRole: Role, newRole: Role, client: EmiliaClient) {
    if (oldRole.name === newRole.name) return;

    const channel = await getGuildLogSettingFromDB({
      guildId: newRole.guild.id,
      intents: GuildLogsIntents.ROLE & EventActions.UPDATE,
      select: { role: true },
      messageType: "update",
      message: newRole,
    });

    if (!channel) return;

    channel.send({
      embeds: [{
        title: "Изменение роли",
        description: `Было обновлено название роли: ${oldRole.name} -> ${newRole.name}`,
        color: hexToDecimal("#ffa600"),
        timestamp: new Date().toISOString(),
      }]
    });
  }
}
