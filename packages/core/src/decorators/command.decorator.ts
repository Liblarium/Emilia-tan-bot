import type { CommandOptions, Constructor } from "../types";
import { Injectable } from "./injectable.decorator";

const COMMAND_METADATA_KEY = Symbol("command:options");

/**
 * Marks a class as a command.
 * @param options Command settings
 * @param options.name Command name
 * @param options.commandType Command type ('command', 'slash', 'both')
 * @param options.description Description (for slash/both)
 * @param options.data SlashCommandBuilder (for slash/both)
 * @param options.delete Delete message
 * @param options.developer Developers only
 * @param options.perms Permission level
 * @param options.test Test team
 * @param options.testers Testers ID
 * @param options.owner Owners only
 * @param options.channels Channel blacklist
 * @param options.guilds Server blacklist
 * @param options.dUsers User blacklist
 * @param options.cooldown Delay
 * @param options.help Help command options
 * @param options.token Injection token
 * @param options.scope Scope
 * @param options.debug Enable debugging
 * @param options.globals If true, the command (as a service) is global
 */
export function Command<T>(options: CommandOptions<T>) {
  return (target: Constructor<T>): void => {
    // Валідація
    if (options.commandType === "command" && (options.description || options.data))
      throw new Error(`Message commands cannot have description or data: ${options.name}`);

    if (
      typeof options.commandType === "string" && // need. If delete this "typeof" - error in includes
      ["slash", "both"].includes(options.commandType) &&
      (!options.description || !options.data)
    )
      throw new Error(`Slash/both commands must have description and data: ${options.name}`);

    if (options.help?.shortDescription && options.help.shortDescription.length > 200)
      throw new Error(`Short description too long for ${options.name}`);

    if (options.help?.extendedDescription && options.help.extendedDescription.length > 2500)
      throw new Error(`Extended description too long for ${options.name}`);

    // Save metadata
    Reflect.defineMetadata(COMMAND_METADATA_KEY, options, target);

    // Call Injectable
    Injectable(options)(target);
  };
}

/**
 * Retrieves the command metadata associated with the given target, if any.
 *
 * @template T
 * @param target The target class to retrieve the metadata for.
 * @returns The metadata associated with the target, or undefined if none is found.
 *
 * This function is a convenience wrapper for `Reflect.getMetadata(COMMAND_METADATA_KEY, target)`.
 */
export function getCommandMetadata<T>(target: Constructor<T>): CommandOptions<T> | undefined {
  return Reflect.getMetadata(COMMAND_METADATA_KEY, target);
}
