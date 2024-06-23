import { BaseEvent } from "../../base/event";
import { Log } from "../../log";

export default class Connected extends BaseEvent {
  constructor() {
    super({ name: `connected`, category: `mongo` });
  }

  execute(name: string) {
    new Log({ text: `База данных [${name}] подключена.`, type: 1, categories: [`mongo`, `global`], event: true });
  }
}
