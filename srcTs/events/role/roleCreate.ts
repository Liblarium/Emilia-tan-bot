import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import {
  EventActions,
  GuildLogsIntents,
  getGuildLogSettingFromDB,
  hexToDecimal,
} from "@util/s";
import type { Role } from "discord.js";

export default class RoleCreate extends BaseEvent {
  constructor() {
    super({
      name: "roleCreate",
      category: "bot",
    });
  }

  async execute(role: Role, client: EmiliaClient) {
    const channel = await getGuildLogSettingFromDB({
      guildId: role.guild.id,
      intents: GuildLogsIntents.ROLE & EventActions.CREATE,
      select: { role: true },
      messageType: "create",
      message: role,
    });

    if (!channel) return;

    channel.send({
      embeds: [{
        title: "Создание роли",
        description: `Была добавлена роль ${role.name} (${role.id})`,
        color: hexToDecimal("#25ff00"),
        timestamp: new Date().toISOString(),
      }]
    });
  }
}
