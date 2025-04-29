import "reflect-metadata";
import "dotenv/config";
import { container } from "tsyringe";
import { BotCore } from "./botCore";
import { ConfigServiceImpl } from "./services/config.service";

// Make sure ConfigServiceImpl is registered
// (the Injectable decorator has already done container.register(ConfigServiceImpl))
container.resolve(ConfigServiceImpl);

// Register the BotCore itself
container.register(BotCore, { useClass: BotCore });

// Create an instance and start
const bot = container.resolve(BotCore);
bot.start();

export * from "./decorators/barrel";
