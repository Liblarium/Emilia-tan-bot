import { REST, Routes, SlashCommandBuilder } from "discord.js";
import type { EmiliaClient } from "../../client";
import { BaseEvent } from "../../base/event";
import { prefix } from "../../utils";
import { Log } from "../../log";

export default class Ready extends BaseEvent {
  constructor() {
    super({ name: `ready`, category: `bot` });
  }

  execute(client: EmiliaClient) {
    if (!client || !client.user || !process.env.TOKEN) return new Log({ text: `Нет client/client.user или не веден TOKEN`, type: `error`, categories: [`global`, `event`] }) as unknown as void;

    new Log({ text: `${client.user.username} включилась.`, type: `info`, categories: [`global`, `event`], db: true });

    const rest = new REST({ version: `10` }).setToken(process.env.TOKEN);
    const slashCommands = client.slashCommands;
    const slashComms: [] | (SlashCommandBuilder | undefined)[] = slashCommands.size > 0 ? slashCommands.map((i) => i.data) : [];
    //let b = 0;

    rest.put(Routes[`applicationCommands`](client.user.id), { body: slashComms }).then(() => {
      new Log({ text: `Загружено ${client.commands.size} message команд.`, type: `info`, categories: [`global`, `command`] });
      new Log({ text: `Зарегестрировано ${slashCommands.size} slash команд.`, type: `info`, categories: [`global`, `command`] });
      new Log({ text: `Загружено ${client.events.size} евентов.`, type: `info`, categories: [`global`, `event`] });
      new Log({ text: `Стандартный префикс: ${prefix}`, type: `info`, categories: [`global`] });
    }).catch((e) => new Log({ text: e, type: `error`, categories: [`global`, `event`] }));
  }
}
