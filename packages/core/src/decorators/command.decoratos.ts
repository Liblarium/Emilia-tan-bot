import { container } from "tsyringe";
import type { CommandDecoratorOptions, Constructor } from "../types";

/**
 * Decorator to define a command with the specified name and options.
 * This decorator registers the target class as a singleton in the
 * dependency injection container and associates command metadata with it.
 *
 * @template T - The type of the class being decorated.
 * @param {string} name - The name of the command.
 * @param {CommandDecoratorOptions} options - The options for the command,
 * including command type, description, and data.
 *
 * The command type can be either "command" or a subtype. If it is not
 * "command" and data is provided, the data will be configured with the
 * command name and description.
 *
 * The metadata for the command, including its name and options, is stored
 * using the `Reflect.defineMetadata` method.
 */
export function Command<T extends Constructor<T>>(
  name: string,
  options: CommandDecoratorOptions
) {
  return (target: Constructor<T>) => {
    if (options.commandType !== "command" && options.data)
      options.data.setName(name).setDescription(options.description);

    Reflect.defineMetadata("command", { name, ...options }, target);
    container.registerSingleton(target);
  };
}
