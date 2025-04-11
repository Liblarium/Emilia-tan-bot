import type { EmiliaClient } from "@client";
import type { AbstractBaseCommand } from "@constants/abstract/AbstractBaseCommand";
import { AbstractHandler } from "@constants/abstract/AbstractHandler";
import { AbstractEmiliaError } from "@constants/abstract/EmiliaAbstractError";
import { CommandType } from "@constants/enum/command";
import { ErrorCode } from "@constants/enum/errorCode";
import { Log } from "@log";
import { logCaller } from "@utils/decorators/logCaller";

export class CommandHandler extends AbstractHandler {
  /**
   * Initializes a new instance of the CommandHandler class.
   * Clears the existing commands in the client and sets up the folder path for commands.
   * Triggers the build process to load commands from the specified directory.
   * Catches and logs any errors encountered during the build process.
   *
   * @param client - The Emilia client instance to associate with this handler.
   */

  constructor(client: EmiliaClient) {
    super(client);

    // Clear existing commands and slash commands in the client.
    client.command.clear();
    client.slashCommand.clear();

    // Associate the client with this handler.
    this.client = client;

    // Set up the folder path for commands.
    this.setFolderPath(["dist", "commands"]);

    // Build the commands from the specified directory.
    this.build().catch(error);
  }

  /**
   * Sets up the logic for handling a command in the client.
   * This method adds the command to the client's command collection and sets up any aliases.
   *
   * @param command - The command object to be added to the client's command collection.
   *                  It should be an instance of AbstractBaseCommand or its subclass.
   *
   * @returns void or a Promise that resolves to void. The function doesn't return a value,
   *          but it may be asynchronous, hence the possibility of returning a Promise<void>.
   *
   * @throws Catches any errors that occur during the process and passes them to the error handling function.
   */
  @logCaller()
  setLogic(command: AbstractBaseCommand): void | Promise<void> {
    const client = this.client;

    try {
      // Add the command to the client's command or slashCommand collection
      if (command.type !== CommandType.Slash)
        client.command.set(command.name, command);
      if (command.type === CommandType.Slash)
        client.slashCommand.set(command.name, command);

      // Set up aliases for the command. Adds the command to the client's command collection with the alias.
      command.aliases.forEach((alias) => client.command.set(alias, command));
    } catch (e) {
      error(e);
    }
  }
}

/**
 * Handles and logs errors encountered during command processing.
 *
 * This function creates a new Log instance to record the error information.
 * It's typically used to capture and log errors that occur in the CommandHandler.
 *
 * @param e - The error object or message to be logged. Can be of any type.
 *
 * @returns void This function doesn't return a value.
 */
function error(e: unknown) {
  new Log({
    text: e,
    type: 2,
    categories: ["global", "handler", "command"],
    tags: ["handler", "command"],
    metadata: { error: e },
    context: { error: e },
    code: e instanceof AbstractEmiliaError ? e.code : ErrorCode.UNKNOWN_ERROR,
  });
}
