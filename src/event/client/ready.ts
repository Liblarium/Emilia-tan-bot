
import type { EmiliaClient } from "@client";
import { Abstract, Config, Enums } from "@constants";
import { Log } from "@log";
import { Decorators, Other, emiliaError } from "@utils";
import { REST, Routes } from "discord.js";

let currentStatusIndex = 0;

export default class Ready extends Abstract.AbstractEvent {
  constructor() {
    super({ name: "ready" });
  }

  public execute(client: EmiliaClient): void {
    if (!client || !client.user || !process.env.TOKEN) throw emiliaError("`client` not found or `TOKEN` empty in .env file!", process.env.TOKEN ? Enums.ErrorCode.CLIENT_NOT_FOUND : Enums.ErrorCode.ENV_REQUIRED);

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    // Get data from slashCommand collection
    const commands = client.slashCommand.size > 0 ? client.slashCommand.map(i => i.data) : [];

    // Update bot status every hour (default 1 hour)
    const time_upd = 1000 * 60 * 60 * 1;

    // Register slash commands
    rest.put(Routes.applicationCommands(client.user.id), { body: commands }).then(() => {
      const text = [`Loaded ${client.command.size} commands`, `Registered ${commands.length} slash commands`, `Loaded ${client.events.size} events`, `Default prefix: ${Config.prefix}`];

      // Log the loaded commands and events
      for (const arr of text) {
        new Log({ text: arr, type: Enums.LogType.Info, categories: ["global", "event"] });
      }

      // Set bot status
      return this.myStatus(client);
    }).catch(e => new Log({ text: e, type: 2, categories: ["global", "event"] }));

    // Update bot status every hour (or other time)
    setInterval(() => this.myStatus(client), time_upd);
  }

  /**
   * Updates the client's status with a random activity from a predefined list.
   * This function selects a random status from an array of game titles and activities,
   * sets it as the client's current activity, and logs the update.
   *
   * @param client - The EmiliaClient instance for which to update the status.
   * @returns void This function doesn't return anything.
   */
  @Decorators.logCaller()
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

    // Get random status from predefined list and set it as the client's current activity
    const random_status = status[Other.random(0, status.length - 1)];

    // Set the status
    client.user?.setActivity(random_status);

    // Log the status update
    new Log({
      text: `Я обновила статус (${currentStatusIndex++}) [${status.indexOf(random_status)}]`,
      type: Enums.LogType.Info,
      categories: ["global", "event"]
    });
  }
}
