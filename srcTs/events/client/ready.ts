import "module-alias/register";
import { BaseEvent } from "@base/event";
import type { EmiliaClient } from "@client";
import { Log } from "@log";
import { prefix, random } from "@util/s";
import { REST, Routes } from "discord.js";

export default class Ready extends BaseEvent {
  constructor() {
    super({ name: "ready", category: "bot" });
  }

  execute(client: EmiliaClient) {
    if (!client?.user || !process.env.TOKEN)
      return new Log({
        text: "Нет client/client.user или не веден TOKEN",
        type: "error",
        categories: ["global", "event"],
      });

    let b = 0;
    const stat = [
      "Dark Souls 2",
      "Dark Souls 3",
      "Death Stranding",
      "Изучение JavaScript",
      "Чтение Базы Данных",
      "Dota 2",
      "Lucu Got Problems",
      "Занимается кодингом",
      "Занимается чаепитием со своей женой",
    ];
    const time_upd = 1000 * 60 * 60 * 1;
    /**
     * Updates the client's status with a random activity from the predefined list.
     * Logs the updated status and its index in the list.
     */
    function myStatus() {
      const rn_stat = stat[random(0, stat.length - 1)];

      client.user?.setActivity(rn_stat);
      new Log({
        text: `Я обновила статус (${b++}) [${stat.indexOf(rn_stat)}]`,
        type: "info",
        categories: ["global", "event"],
      });
    }

    new Log({
      text: `${client.user.username} включилась.`,
      type: "info",
      categories: ["global", "event"],
    });

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
    const slashCommands = client.slashCommands;
    const slashComm =
      slashCommands.size > 0 ? slashCommands.map((i) => i.data) : [];

    rest
      .put(Routes.applicationCommands(client.user.id), { body: slashComm })
      .then(() => {
        new Log({
          text: `Загружено ${client.commands.size.toString()} message команд.`,
          type: "info",
          categories: ["global", "command"],
        });
        new Log({
          text: `Зарегистрировано ${slashCommands.size.toString()} slash команд.`,
          type: "info",
          categories: ["global", "command"],
        });
        new Log({
          text: `Загружено ${client.events.size.toString()} евентов.`,
          type: "info",
          categories: ["global", "event"],
        });
        new Log({
          text: `Стандартный префикс: ${prefix}`,
          type: "info",
          categories: ["global"],
        });
        return myStatus();
      })
      .catch(
        (e) =>
          new Log({
            text: e,
            type: "error",
            categories: ["global", "event"],
          }),
      );

    setInterval(myStatus, time_upd);
  }
}
