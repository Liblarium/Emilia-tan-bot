import { BaseEvent } from "../../base/event";
import { Log } from "../../log";

export default class ErrorEvent extends BaseEvent {
  constructor() {
    super({ name: `error`, category: `mongo` });
  }

  execute(err: any, name: string) {
    new Log({ text: err, type: 2, categories: [`mongo`, `global`], event: true });
  }
}
