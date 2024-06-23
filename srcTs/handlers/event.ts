import { connection, Connection } from "mongoose";
import { BaseEvent } from "../base/event";
import { BaseHandler } from "../base/handler";
import { EmiliaClient } from "../client";
import { Log } from "../log";

type EventMapType = { [key: string]: () => EmiliaClient | Connection };

export class EventHandler extends BaseHandler {
  constructor(client: EmiliaClient) {
    super(client);
    this.client = client;
    this.setFolderPath([`srcJs`, `events`]);
    this.build();
  }

  setLogic(event: BaseEvent): null | void {
    const client = this.client;
    try {
      const eventExecute = async (...args: any[]) => { await event.execute(...args, client) };
      const mongoExecute = async () => { await event.execute(process.env.DB_NAME) };

      if (!event.category) {
        new Log({ text: `Похоже ${event?.name || `Ошибка`} не имеет категории.`, type: `error`, categories: [`global`, `handler`, `event`] });
        return null;
      }

      client.events.set(event.name, event.category);

      const eventMap: EventMapType = {
        bot: () => client[event.once ? `once` : `on`](event.name, eventExecute),
        mongo: () => connection[event.once ? `once` : `on`](event.name, mongoExecute),
      };

      if (!(event.category in eventMap)) {
        new Log({ text: `Указаная категория (${event.category}) не входит в число доступных категорий. Доступные: bot и mongo`, type: `error`, categories: [`global`, `handler`, `event`] });
        return null;
      }

      eventMap[event.category]();
    } catch (e) {
      new Log({ text: e, type: `error`, categories: [`global`, `handler`, `event`] });
      return null;
    }
  }
}
