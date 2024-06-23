import { CommandClassOptions, CommandOptions, IBaseCommand } from "@type/base/command";
import { SlashCommandBuilder, Message, ChatInputCommandInteraction } from "discord.js";
//import { Database } from "../database";
import { EmiliaTypeError } from "../utils";
import { Log } from "../log";

export class BaseCommand implements IBaseCommand {
  /** Это `new SlashCommandBuilder()`. Только для `/` команд. Доп параметры `/` идут только через неё */
  data: SlashCommandBuilder;
  /** Имя команды */
  name: string;
  /**
   * Параметры команды.
   * - **type**: `command` | `slash` - тип команды.
   * - **aliases**: `string[] | []` - альтернативные названия команды.
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
  /** Класс для работы с Базой данных */
  //db: Database;
  /**
   * Базовый класс для команд
   * @param {CommandOptions} commandOptions
   * Пример использования
   * ```js
   * //обычная команда
   * import { BaseCommand } from "../Base/command";
   *
   * export default class SomeCommand extends BaseCommand {
   *  constructor() {
   *    super({ name: `somecommand`,
   *      option: {
   *       type: `command`, //Обычная команда. Есть ещё slash
   *       aliases: [`sm`], //только для обычных команд. Альтернативные названия для вызова команды
   *    }});
   *   }
   *
   *   execute(message: Message, args: any[], commandName: string, client: EmiliaClient) {
   *     message.channel.send({ content: `Сообщение о использовании ${commandName}` });
   *   }
   *  }
   * }
   *```
   */
  constructor({ name, description, option }: CommandOptions) {
    if (!name) throw new EmiliaTypeError(`Вы не указали имя команды!`);
    if (!option || Object.entries(option).length === 0) throw new EmiliaTypeError(`Вы не указали параметры для команды!`);
    if (![`command`, `slash`].includes(option?.type)) throw new EmiliaTypeError(`Вы указали не поддерживаемый тип (${option?.type || `[Не указано]`} команды! [Разрешено: command | slash])`);

    this.name = name;
    this.data = new SlashCommandBuilder();
    //this.db = new Database();
    this.option = {
      type: option.type,
      aliases: option.aliases || [],
      developer: option.developer ?? false,
      perms: option.perms || 0,
      test: option.test ?? false,
      testers: option.testers || [],
      owner: option.owner ?? false,
      guilds: option.guilds || [],
      channels: option.channels || [],
      dUsers: option.dUsers || [],
    };

    if (option?.type == `command`) {
      this.option.delete = option?.delete ?? false;
    } else {
      this.data.setName(name);
      if (description) this.data.setDescription(description);
    }
  }

  /**
   * @param {...any} args
   * @returns {void | Log | Message | ChatInputCommandInteraction | Promise<void | Message | ChatInputCommandInteraction | Log>}
   */
  execute(...args: any[]): void | Log | Message | ChatInputCommandInteraction | Promise<void | Message | ChatInputCommandInteraction | Log> {
    throw new EmiliaTypeError(`Вы не реализовали свой execute для [${this.name}] ${this.option.type} команды!`);
  }
}
