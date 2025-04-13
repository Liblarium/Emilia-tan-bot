import { AbstractEvent } from "@abstract/AbstractEvent";
import type { EmiliaClient } from "@client";
import { prefix } from "@core/config";
import { CategoryEvents } from "@enum/EventCategoryType";
import { ErrorCode } from "@enum/errorCode";
import { LogType } from "@enum/log";
import { Log } from "@log";
import { LogFactory } from "@log/logFactory";
import { LogMethod, Loggable } from "@utils/decorators/loggable";
import { emiliaError } from "@utils/error/EmiliaError";
import { random } from "@utils/helpers/random";
import { REST, Routes } from "discord.js";

let currentStatusIndex = 0;

@Loggable(Log, {
  type: LogType.Info, categories: ["global", "event"], tags: ["event", "ready"], code: ErrorCode.OK,
  text: "Bot is ready!",
})
export default class Ready extends AbstractEvent<CategoryEvents.Bot, "ready"> {
  constructor() {
    super({ name: "ready", category: CategoryEvents.Bot });
  }

  @LogMethod({ type: LogType.Info, categories: ["global", "event"], tags: ["event", "ready"] })
  public execute(client: EmiliaClient): void {
    if (!client || !client.user || !process.env.TOKEN) throw emiliaError("`client` not found or `TOKEN` empty in .env file!", process.env.TOKEN ? ErrorCode.CLIENT_NOT_FOUND : ErrorCode.ENV_REQUIRED);

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    // Get data from slashCommand collection
    const commands = client.slashCommand.size > 0 ? client.slashCommand.map(i => i.data) : [];

    // Update bot status every hour (default 1 hour)
    const time_upd = 1000 * 60 * 60 * 1;

    // Register slash commands
    rest.put(Routes.applicationCommands(client.user.id), { body: commands }).then(async () => {
      const text = [`Loaded ${client.command.size} commands`, `Registered ${commands.length} slash commands`, `Loaded ${client.events.size} events`, `Default prefix: ${prefix}`];

      // Log the loaded commands and events
      for (const arr of text) {
        await LogFactory.log({ text: arr, type: LogType.Info, categories: ["global", "event"], tags: ["event", "ready"], code: ErrorCode.OK });
      }

      // Set bot status
      return this.myStatus(client);
    }).catch(async (e) => await LogFactory.log({ text: e, type: 2, categories: ["global", "event"], tags: ["event", "ready"], code: ErrorCode.UNKNOWN_ERROR }));

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
  @LogMethod({ type: LogType.Info, categories: ["global", "event"], tags: ["event", "ready", "myStatus"] })
  myStatus(client: EmiliaClient): void {
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
    const random_status = status[random(0, status.length - 1)];

    // Set the status
    client.user?.setActivity(random_status);

    // Log the status update
    LogFactory.log({
      text: `Я обновила статус (${currentStatusIndex++}) [${status.indexOf(random_status)}]`,
      type: LogType.Info,
      categories: ["global", "event"],
      tags: ["event", "ready"],
      code: ErrorCode.OK
    });
  }
}
