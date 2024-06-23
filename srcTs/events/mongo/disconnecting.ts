import { BaseEvent } from "../../base/event";
import { Log } from "../../log";

export default class Disconnecting extends BaseEvent {
  constructor() {
    super({ name: `disconnecting`, category: `mongo` });
  }

  execute(name: string) {
    new Log({ text: `База Данных [${name}] отключается...`, type: 2, categories: [`mongo`, `global`] });
  }
}
