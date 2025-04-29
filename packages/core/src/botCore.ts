import { Inject, Injectable } from "./decorators/barrel";
import { ConfigServiceImpl } from "./services/config.service";

@Injectable()
export class BotCore {
  constructor(@Inject(ConfigServiceImpl) private config: ConfigServiceImpl) {}

  public start() {
    const token = this.config.get("BOT_TOKEN");
    if (!token) {
      console.error("⛔ BOT_TOKEN is not defined");
      process.exit(1);
    }
    console.log("✅ BotCore initialized with token:", token);
    // Here you will later connect discord.js, events, command handlers, etc.
  }
}
