import type { EmiliaClient } from "@client";
import { Log } from "@log";
import { AbstractHandler } from "../constants/abstract/AbstractHandler";
import { AbstractEvent } from "@constants/abstract/AbstractEvent";

const catchs = (e: unknown) => {
  console.error(e);
};

export class EventHandler extends AbstractHandler {
  /**
   * The constructor for the handler class.
   * @param client - The client which the handler is attached to.
   * 
   * The handler will look for files in the "dist/events" directory and will filter them by the regular expression `^[^.]+\.(j|t)s$`.
   * The handler will then import each of the filtered files and check if they are classes.
   * If they are, it will create an instance of the class and pass it to the `setLogic` method.
   * If the `setLogic` method returns `null`, it will skip the file.
   * If any errors occur during the build process, it will log the error.
   */
  constructor(client: EmiliaClient) {
    super(client);
    this.client = client;
    this.setFolderPath(["dist", "events"]);
    this.build().catch(catchs);
  }

  /**
   * Sets up the logic for handling an event.
   * This function configures the event execution, logs errors, and manages event categories.
   * 
   * @param event - The AbstractEvent object representing the event to be handled.
   * @returns void if the event is successfully set up, null if there's an error or invalid configuration.
   * 
   * @throws Will log errors but not throw them, returning null instead.
   */
  setLogic(event: AbstractEvent): null | void {
    const client = this.client;

    try {
      const eventExecute = async (...args: unknown[]) => {
        try {
          await event.execute(...args, client);
        } catch (e) {
          new Log({ text: e, type: 2, categories: ["global", "handler", "event"] });
          return null;
        }
      };

      if (!event.category) {
        new Log({ text: `It seems like ${event?.name ?? "error"} doesn't have a category.`, type: 2, categories: ["global", "handler", "event"] });
        return null;
      }

      client.events.set(event.name, event.category);

      const eventMap: Record<string, () => EmiliaClient> = {
        bot: () => client[event.once ? "once" : "on"](event.name, eventExecute)
      };

      if (!(event.category in eventMap)) {
        new Log({ text: `The specified category (${event.category}) is not among the available categories. Available: bot and mongo`, type: 2, categories: ["global", "handler", "event"] });
        return null;
      }

      eventMap[event.category]();
    } catch (e: unknown) {
      new Log({ text: e, type: 2, categories: ["global", "handler", "event"] });
      return null;
    }
  }

}
