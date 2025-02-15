
import { Abstract, Enums, prefix } from "@constants";
import { EmiliaClient } from "@client";
import { REST, Routes } from "discord.js";
import { Log } from "@log";
import { emiliaError, random } from "@utils";

let currentStatusIndex = 0;

export default class Ready extends Abstract.AbstractEvent {
  constructor() {
    super({ name: "ready" });
  }

  public execute(client: EmiliaClient): void {
    if (!client || !client.user || !process.env.TOKEN) throw emiliaError("`client` not found or `TOKEN` empty in .env file!");

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    const commands = client.commands.size > 0 ? client.commands.map(i => i.data) : [];

    const time_upd = 1000 * 60 * 60 * 1;

    // Register slash commands
    rest.put(Routes.applicationCommands(client.user.id), { body: commands }).then(() => {
      const text = [`Loaded ${client.commands.size} commands`, `Loaded ${client.events.size} events`, `Default prefix: ${prefix}`];

      // Log the loaded commands and events
      for (const arr of text) {
        new Log({ text: arr, type: Enums.LogType.Info, categories: ["global", "event"] });
      }

      return this.myStatus(client);
    }).catch(e => new Log({ text: e, type: 2, categories: ["global", "event"] }));

    setInterval(() => this.myStatus(client), time_upd);
  }

  /**
   * Updates the client's status with a random activity from a predefined list.
   * Logs the updated status and its index in the list.
   * 
   * @param client - The EmiliaClient instance to update the status for.
   * @returns void This function doesn't return anything.
   */
  private myStatus(client: EmiliaClient): void {
    const status = [
      "Dark Souls 2",
      "Dark Souls 3",
      "Death Stranding",
      "Изучение JavaScript",
      "Чтение Базы Данных",
      "Dota 2",
      "Lucu Got Problems",
      "Занимается кодингом",
      "Занимается чаепитием со своей женой",
      "Гвинт с Геральдом",
      "The Witcher 3: Wild Hunt",
      "Гвинт"
    ];
    const random_status = status[random(0, status.length - 1)];

    client.user?.setActivity(random_status);

    new Log({
      text: `Я обновила статус (${currentStatusIndex++}) [${status.indexOf(random_status)}]`,
      type: Enums.LogType.Info,
      categories: ["global", "event"]
    });
  }

}
