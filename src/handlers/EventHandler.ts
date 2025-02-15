import type { EmiliaClient } from "@client";
import { Log } from "@log";
import { Abstract } from "@constants";
import { Decorators } from "@utils";

const catchs = (e: unknown) => {
  new Log({ text: e, categories: ["global", "handler", "event"], type: 2 });
};

export class EventHandler extends Abstract.AbstractHandler {
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
  @Decorators.logCaller
  setLogic(event: Abstract.AbstractEvent): null | void {
    const client = this.client;

    try {
      const eventExecute = async (...args: unknown[]) => {
        try {
          await event.execute(...args, client);
        } catch (e) {
          catchs(e);
          return null;
        }
      };

      if (!event.category) {
        catchs(`It seems like ${event?.name ?? "error"} doesn't have a category.`);
        return null;
      }

      client.events.set(event.name, event.category);

      const eventMap: Record<string, () => EmiliaClient> = {
        bot: () => client[event.once ? "once" : "on"](event.name, eventExecute)
      };

      if (!(event.category in eventMap)) {
        catchs(`The specified category (${event.category}) is not among the available categories. Available: bot and mongo`);
        return null;
      }

      eventMap[event.category]();
    } catch (e) {
      catchs(e);
      return null;
    }
  }

}
