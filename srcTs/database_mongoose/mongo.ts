import { connect, set } from "mongoose";
import { Log } from "../log";

export class MongoConnect {
  constructor() {
    set(`strictQuery`, true);
    this.run();
  }

  private run() {
    const dbName = process.env.DB_NAME as string;
    const url = process.env.DB_URI as string;

    /* prettier-ignore */
    connect(url).then(() => new Log({ text: `База данных ${dbName} подключена`, type: 1, categories: [`global`, `mongo`] })).catch(console.error);
  }
}
