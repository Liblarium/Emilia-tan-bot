import { BaseEvent } from "../../base/event";
import { Log } from "../../log";

export default class Connecting extends BaseEvent {
  constructor() {
    super({ name: `connecting`, category: `mongo` });
  }

  execute(name: string) {
    new Log({ text: `Подключение [${name}]...`, type: 1, categories: [`mongo`, `global`], event: true });
  }
}
