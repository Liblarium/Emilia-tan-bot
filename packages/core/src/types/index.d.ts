import type { SlashCommandBuilder } from "discord.js";
import type { Container, Newable, ServiceIdentifier } from "inversify";

/**
 * Represents a class constructor
 */
export type Constructor<T = unknown, Args extends any[] = any[]> = new (...args: Args) => T;

/**
 * Represents the arguments of a class constructor
 */
export type ConstructorArgs<T extends Constructor> = T extends Constructor<any, infer P>
  ? P
  : never;

export type CommandType = "command" | "slash" | "both";

/**
 * Custom realization of type `Pick<T, K>`, but supported string keys
 */
export type PickType<T, K extends string> = {
  [P in Extract<K, keyof T>]: T[P];
};

export interface CommandClassOptions {
  helpOptions: HelpCommandOptions;
  commandOptions: CommandBaseOptions;
}

interface SlashOrBothCommand extends CommandBaseOptions {
  /**
   * Command type - "slash" | "both"
   */
  commandType: PickType<CommandType, "command">;
  /**
   * Command description
   */
  description: string;
  /**
   * He is a slash command data builder
   *
   * Don't use `.setName` and `.setDescription` - he used by decorator. If need other lang's - use
   *
   * @see {@link https://discord.com/developers/docs/interactions/application-commands Application Commands}
   * @see {@link https://discord.com/developers/docs/interactions/application-commands#slash-commands Slash Commands}
   */
  data: SlashCommandBuilder;
}

interface MessageCommand extends CommandBaseOptions {
  /**
   * Command type - "command"
   */
  commandType: Omit<CommandType, "command">;
  /**
   * Command description. Only for slash commands. Not have effect for commands
   *
   * If you need description - use `commandType: "both"` or "slash"
   */
  description: never;
  /**
   * Slash command data. Only for slash commands. Not have effect for commands
   *
   * If you need description - use `commandType: "both"` or "slash"
   */
  data: never;
}

export interface CommandBaseOptions {
  /**
   * Whether to delete the message with the command? (The message itself | command type only)
   */
  delete?: boolean;
  /**
   * Command available only for developers
   */
  developer?: boolean;
  /**
   * Permission level limitations (not Discord permissions)
   */
  perms?: number;
  /**
   * Is the command for testing purposes?
   */
  test?: boolean;
  /**
   * Testers' IDs
   */
  testers?: string[];
  /**
   * Is the command available for server owners?
   */
  owner?: boolean;
  /**
   * Channels where the command will not respond (IDs)
   */
  channels?: string[];
  /**
   * Guilds where the command will not respond (IDs)
   */
  guilds?: string[];
  /**
   * Users from which the command will not respond (IDs)
   */
  dUsers?: string[];
  /**
   * Command cooldown
   */
  cooldown?: number;
  /**
   * Options from the help command
   */
  help?: HelpCommandOptions;
}

/**
 * Type for the options object passed to the Command decorator
 */
export interface HelpCommandOptions {
  /**
   * Command category
   */
  category: string;
  /**
   * Command short description. Used on help list command
   *
   * Max length: 200
   */
  shortDescription: string;
  /**
   * Command extended description. Used on help info command
   *
   * Max length: 2500
   */
  extendedDescription: string;
  /**
   * Hidden command on help list
   */
  hidden?: boolean;
  /**
   * Command usage
   *
   * @example
   * "command | command [arg1] [arg2]"
   */
  usage: string;
  /**
   * Command examples
   *
   * @example
   * ["command [arg1] [arg2]", "command [arg1"]
   */
  examples: string[];
}

// Тип для області видимості
export type ModuleScope = "singleton" | "transient";

/**
 * Базовий інтерфейс провайдера
 */
export interface BaseProvider<T = unknown> {
  /**
   * Токен для ін'єкції
   */
  provide: ServiceIdentifier<T>;
  /**
   * Область видимості (singleton або transient)
   */
  scope?: ModuleScope;
  /**
   * Режим дебагу
   */
  debug?: boolean;
}

/**
 * Провайдер, який використовує клас для створення залежності.
 */
interface ClassProvider<T = any> extends BaseProvider<T> {
  /**
   * Клас для створення залежності
   */
  useClass: Newable<T>;
}

/**
 * Провайдер, який використовує значення для створення залежності.
 */
export interface ValueProvider<T> extends BaseProvider<T> {
  /**
   * Значення для створення залежності
   */
  useValue: T;
}

/**
 * Провайдер, який використовує фабричну функцію для створення залежності.
 * @template T Тип результату фабрики
 */
export interface FactoryProvider<T = unknown> extends BaseProvider<T> {
  /**
   * Функція, що створює залежність (синхронна або асинхронна)
   * @param container Контейнер
   * @returns Залежність
   */
  useFactory: (container: Container) => T | Promise<T>;
}

/**
 * Bind options
 */
interface BindUse<T = unknown> {
  /**
   * Token for injection
   */
  token: ServiceIdentifier<T>;
  /**
   * Debug flag
   */
  debug?: boolean;
}

/**
 * Binding new Factory
 */
export interface BindUseFactory<T = unknown> extends BindUse<T> {
  useFactory: FactoryProvider<T>["useFactory"];
  /**
   * Singleton or Transient
   */
  scope?: ModuleScope;
}

/**
 * Binding new Value
 */
export interface BindUseValue<T = unknown> extends BindUse<T> {
  useValue: ValueProvider<T>["useValue"];
}

/**
 * Binding new Class
 */
export interface BindUseClass<T = unknown> extends BindUse<T> {
  useClass?: ClassProvider<T>["useClass"];
  /**
   * Singleton or Transient
   */
  scope?: ModuleScope;
}

/**
 * Провайдер, який використовує клас для створення залежності.
 */
export type ModuleProvider<T = unknown> = ClassProvider<T> | ValueProvider<T> | FactoryProvider<T>;

/**
/**
 * Опції для конфігурації модуля.
 */
export interface ModuleOptions {
  /**
   * Модулі для імпорту (резолвляться у глобальному контейнері).
   */
  imports?: ModuleProvider[];
  /**
   * Провайдери (реєструються у дочірньому контейнері).
   */
  providers?: ModuleProvider[];
  /**
   * Обробники (реєструються у дочірньому контейнері).
   */
  controllers?: ModuleProvider[];
  /**
   * Токени для експорту.
   */
  exports?: ServiceIdentifier[];
  /**
   * Увімкнути дебаг-логування.
   */
  debug?: boolean;
  /**
   * Якщо true, експорти не додаються до глобального контейнера.
   */
  restrictExports?: boolean;
}

// Метадані для @Injectable
export interface InjectableOptions<T = unknown> {
  /**
   * Токен для ін'єкції
   */
  token?: ServiceIdentifier<T>;
  /**
   * Область видимості (singleton або transient)
   */
  scope?: ModuleScope;
  /**
   * Увімкнути дебаг-логування
   */
  debug?: boolean;
  /**
   * Якщо true, сервіс глобальний
   */
  globals?: boolean;
  /**
   * Клас для ін'єкції
   */
  useClass?: Constructor<T>;
  /**
   * Значення для ін'єкції
   */
  useValue?: T;
  /**
   * Функція, що створює залежність (синхронна або асинхронна)
   * @param container Контейнер
   * @returns Залежність
   */
  useFactory?: (container: Container) => T | Promise<T>;
}

/**
 * Command options
 */
export type CommandOptions<T> = CommandDecoratorOptions<T> & (MessageCommand | SlashOrBothCommand);

export interface CommandDecoratorOptions<T = unknown> extends InjectableOptions<T> {
  /**
   * Назва команди
   */
  name: string;
}

export interface EventOptions<T = unknown> extends InjectableOptions<T> {
  /**
   * Назва подіі
   */
  event: string;
  /**
   * Якщо true, подія одноразова
   */
  once?: boolean;
  /**
   * Джерело події (discord, prisma, etc.)
   */
  source?: string;
}

export interface ModuleOptions {
  /**
   * Модулі для імпорту (резолвляться у глобальному контейнері).
   */
  imports?: Constructor[];
  /**
   * Провайдери (реєструються у дочірньому контейнері).
   */
  providers?: ModuleProvider[];
  /**
   * Обробники (реєструються у дочірньому контейнері).
   */
  controllers?: ModuleProvider[];
  /**
   * Токени для експорту.
   */
  exports?: ServiceIdentifier[];
  /**
   * Увімкнути дебаг-логування
   */
  debug?: boolean;
  /**
   * Якщо true, експорти не додаються до глобального контейнера
   */
  restrictExports?: boolean;
}

export interface PluginOptions extends ModuleOptions {
  /**
   * Провайдери (реєструються у глобальному контейнері).
   */
  events?: Constructor[];
  /**
   * Команди
   */
  commands?: Constructor[];
}
