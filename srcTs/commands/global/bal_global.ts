import { BaseCommand } from "@base/command";
import { getRandomBall } from "@util/commands/ball";
import type { Message } from "discord.js";

export default class Ball extends BaseCommand {
  constructor() {
    super({
      name: "шар",
      option: {
        type: "command",
        delete: false,
      }
    });
  }

  async execute(message: Message, args: unknown[]) {
    if (!message.guildId || message.channel.isDMBased()) return;
    if (!args[0]) return message.channel.send({ content: "А где вопрос?" });

    const ballMessage = getRandomBall(["334418584774246401", "451103537527783455"].includes(message.guildId) ? 14 : 40);
    await message.reply(`\u000A${ballMessage}`);
  }
}