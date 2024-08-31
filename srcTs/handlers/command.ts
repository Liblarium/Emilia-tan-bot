import type { BaseCommand } from "@base/command";
import { BaseHandler } from "@base/handler";
import type { EmiliaClient } from "@client";
import { Log } from "@log";

export class CommandHandler extends BaseHandler {
  constructor(client: EmiliaClient) {
    super(client);
    this.client = client;
    this.client.slashCommands.clear();
    this.client.commands.clear();

    this.setFolderPath(["srcJs", "commands"]);
    this.build().catch((e: unknown) => { console.error(e); });
  }

  setLogic(command: BaseCommand): void | Promise<void> {
    const client = this.client;

    try {
      if (!["command", "slash"].includes(command.option.type))
        throw new Log({
          text: `${command.name || "Ошибка"} имеет ${command.option.type || "[Не указано]"} не поддерживаемый тип. Доступные: command, slash.`,
          type: "error",
          categories: ["global", "handler", "command"],
        });

      const commandType =
        command.option.type === "command" ? "commands" : "slashCommands";

      client[commandType].set(command.name, command);

      command.option.aliases.forEach((alias) =>
        client[commandType].set(alias, command),
      );
    } catch (e: unknown) {
      new Log({
        text: (e as Error).message,
        type: "error",
        categories: ["global", "handler", "command"],
      });
    }
  }
}
