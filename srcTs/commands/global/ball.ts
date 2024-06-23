import { BaseCommand } from "../../base/command";
import { sharMap } from "../../util/ball.list";
import { EmiliaClient } from "../../client";
import { Message } from "discord.js";
import { random } from "../../utils";

export default class Ball extends BaseCommand {
  constructor() {
    super({
      name: `шар`,
      option: {
        type: `command`,
        delete: false,
      }
    });
  }

  async execute(message: Message, args: any[], commandName: string, client: EmiliaClient) {
    if (!message.guildId) return;
    if (!args[0]) return message.channel.send({ content: `А где вопрос?` });

    const ballMessage = [`334418584774246401`, `451103537527783455`].includes(message.guildId) ? random(0, 14) : random(0, 40);
    await message.reply(`\u000A${sharMap[ballMessage]}`);
  }
}