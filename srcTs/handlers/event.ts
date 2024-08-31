import type { BaseEvent } from "@base/event";
import { BaseHandler } from "@base/handler";
import type { EmiliaClient } from "@client";
import { Log } from "@log";

type EventMapType = Record<string, () => EmiliaClient>;

const catchs = (e: unknown) => { console.error(e); };

export class EventHandler extends BaseHandler {
  constructor(client: EmiliaClient) {
    super(client);
    this.client = client;
    this.setFolderPath(["srcJs", "events"]);
    this.build().catch(catchs);
  }

  setLogic(event: BaseEvent): null | undefined {
    const client = this.client;
    try {
      const eventExecute = async (...args: unknown[]) => { await event.execute(...args, client); };

      if (!event.category) {
        new Log({ text: `Похоже ${event?.name ?? "Ошибка"} не имеет категории.`, type: "error", categories: ["global", "handler", "event"] });
        return null;
      }

      client.events.set(event.name, event.category);

      const eventMap: EventMapType = {
        bot: () => client[event.once ? "once" : "on"](event.name, (e: unknown[]) => { eventExecute(e).catch(catchs); })
      };

      if (!(event.category in eventMap)) {
        new Log({ text: `Указаная категория (${event.category}) не входит в число доступных категорий. Доступные: bot и mongo`, type: "error", categories: ["global", "handler", "event"] });
        return null;
      }

      eventMap[event.category]();
    } catch (e: unknown) {
      new Log({ text: (e as Error).message, type: "error", categories: ["global", "handler", "event"] });
      return null;
    }
  }
}
