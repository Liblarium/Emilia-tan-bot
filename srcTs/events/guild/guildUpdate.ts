import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import { EventActions, GuildLogsIntents, getGuildLogSettingFromDB, hexToDecimal } from "@util/s";
import type { Guild } from "discord.js";

export default class GuildUpdate extends BaseEvent {
  constructor() {
    super({ name: "guildUpdate", category: "bot" });
  }
  async execute(oldGuild: Guild, newGuild: Guild, client: EmiliaClient) {
    const channel = await getGuildLogSettingFromDB({
      guildId: newGuild.id,
      select: { guild: true },
      intents: GuildLogsIntents.GUILD | EventActions.UPDATE,
      messageType: "update",
      message: newGuild,
    });

    if (!channel) return;

    const err = "[Ошибка]";
    const updateStat = {
      name: oldGuild.name !== newGuild.name,
      afkChannel: oldGuild.afkChannelId !== newGuild.afkChannelId,
      banner: oldGuild.banner !== newGuild.banner,
      owner: oldGuild.ownerId !== newGuild.ownerId
    };
    const { name, afkChannel, banner, owner } = updateStat;

    if (!name || !afkChannel || !banner || !owner) return; //Нет указанных изменений

    async function editMess() {
      return name ? `Новое название сервера: ${newGuild.name}` : `Новый ${afkChannel ? `afk канал - ${newGuild.afkChannel} (${newGuild.afkChannel?.name ?? err})` : banner ? "банер" : owner ? `владелец сервера - ${await newGuild.fetchOwner()} (${(await newGuild.fetchOwner()).user.username})` : err}`;
    }

    channel.send({
      embeds: [{
        title: "Обновление сервера",
        description: await editMess(),
        image: banner ? { url: newGuild.bannerURL({ forceStatic: false }) ?? "" } : undefined,
        color: hexToDecimal("#ffa600"),
        timestamp: new Date().toISOString()
      }]
    });

  }
}
