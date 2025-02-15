import { Abstract } from '@constants';
import { Client, Collection, type ClientOptions } from 'discord.js';

export class EmiliaClient extends Client {
  /**
   * @type {Collection<string, Abstract.AbstractBaseCommand>} - The collection of commands
   */
  public commands: Collection<string, Abstract.AbstractBaseCommand> = new Collection();
  /**
   * @type {Collection<string, string>} - The collection of events
   */
  public events: Collection<string, string> = new Collection();

  /**
   * Creates an instance of EmiliaClient.
   *
   * @param {ClientOptions} options - The options for the Discord client.
   */
  public constructor(options: ClientOptions) {
    super(options);
  }

  public build(): void {
    console.log('Building client...');
  };
}