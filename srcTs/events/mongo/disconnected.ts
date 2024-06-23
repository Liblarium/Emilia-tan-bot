import { BaseEvent } from "../../base/event";
import { Log } from "../../log";

export default class Disconnected extends BaseEvent {
  constructor() {
    super({ name: `disconnected`, category: `mongo` });
  }

  execute(name: string) {
    new Log({ text: `База Данных [${name}] отключена.`, type: 2, categories: [`mongo`, `global`] });
  }
}
