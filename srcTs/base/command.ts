import type { ArrayMaybeEmpty } from "@type";
import type {
  CommandClassOptions,
  CommandOptions,
  ExecuteReturns,
} from "@type/base/command";
import { EmiliaTypeError } from "@util/s";
import { SlashCommandBuilder } from "discord.js";

export class BaseCommand {
  /** Это `new SlashCommandBuilder()`. Только для `/` команд. Доп параметры `/` идут только через неё */
  data: SlashCommandBuilder;
  /** Имя команды */
  name: string;
  /**
   * Параметры команды.
   * - **aliases**: `string[] | []` - альтернативные названия команды. Нет в slash командах
   * - **delete**: `boolean` - доступна только для обычных команд. Удалять ли сообщение с командой
   * - **developer**: `boolean` - команда доступна только для разработчика
   * - **perms**: `number` - ограничения по уровню доступа. Не по правам диса
   * - **test**: `boolean` - тестовая ли команда. Работает только в связке с testers
   * - **testers**: `string[] | []` - массив с id тех, кому доступна эта команда. Работает только при test: true
   * - **owner**: `boolean` - команда доступна только для владельца сервера
   * - **guilds**: `string[] | []` - массив с id серверов, где не будет доступна команда
   * - **channels**: `string[] | []` - массив с id каналов, где не будет доступна команда
   * - **dUsers**: `string[] | []` - массив с id пользователей, которым не будет доступна команда
   */
  option: CommandClassOptions;

  aliases: ArrayMaybeEmpty<string>;
  /**
   * Тип команды. command | slash
   */
  commandType: "command" | "slash";
  /**
   * Базовый класс для команд
   *
   *
   * Пример использования
   * ```ts
   * //обычная команда
   * import { BaseCommand } from "../Base/command";
   * import type { EmiliaClient } from "@client";
   * import type { Message } from "discord.js";
   *
   * export default class SomeCommand extends BaseCommand<"command"> {
   *  constructor() {
   *    super({ name: `someCommand`,
   *      commandType: `command`, //Обычная команда. Есть ещё slash
   *      option: {
   *       aliases: [`sm`], //только для обычных команд. Альтернативные названия для вызова команды
   *    }});
   *   }
   *
   *   execute(message: Message, args: string[], commandName: string, client: EmiliaClient) {
   *     message.channel.send({ content: `Сообщение о использовании ${commandName}` });
   *   }
   *  }
   * }
   *```
   * @param commandOptions Параметры
   * @param commandOptions.name название команды
   * @param commandOptions.description описание команды
   * @param commandOptions.option опции для команды (не /. Смотри выше)
   */
  constructor({ name, description, aliases, commandType, option = {} }: CommandOptions) {
    if (!name) throw new EmiliaTypeError("Вы не указали имя команды!");
    if (!["command", "slash"].includes(commandType))
      throw new EmiliaTypeError(
        `[${name}]: Вы указали не поддерживаемый тип (${typeof commandType === "string" ? commandType.length > 1 ? "[Не указано]" : commandType : "[Ошибка]"} команды! [Разрешено: command | slash])`,
      );

    this.commandType = commandType;
    this.name = name;
    this.data = new SlashCommandBuilder();
    this.option = {
      developer: option.developer ?? false,
      test: option.test ?? false,
      testers: option.testers ?? [],
      owner: option.owner ?? false,
      guilds: option.guilds ?? [],
      channels: option.channels ?? [],
      dUsers: option.dUsers ?? [],
    };
    this.aliases = aliases ?? [];

    if (commandType === "command") {
      this.option = {
        ...this.option,
        perms: option.perms ?? 0,
        delete: option.delete ?? false,
      };
    }
    if (commandType === "slash") {
      this.data.setName(name);
      if (description) this.data.setDescription(description);
    }
  }

  execute(...args: unknown[]): ExecuteReturns | Promise<ExecuteReturns> {
    throw new EmiliaTypeError(
      `Вы не реализовали свой execute для [${this.name}] ${this.commandType} команды!`,
    );
  }
}
