import type { Message, TextChannel } from "discord.js";
import { BaseCommand } from "@base/command";
import { Log } from "@log";

export default class Send extends BaseCommand {
  constructor() {
    super({
      name: "скажи",
      option: {
        aliases: [],
        type: "command",
        delete: true,
        developer: true,
      }
    });
  }

  async execute(message: Message, args: string[]) {
    let msg: string;
    const channel = message.mentions.channels.first() as unknown as TextChannel | undefined;
    new Log({ text: `${message.member?.user.username ?? "[Ошибка]"} использовал Скажи`, type: 1, categories: ["global", "command"] });

    if (!args[0]) return message.channel.send({ content: "А где текст?" });

    if (channel) {
      msg = args.slice(1).join(" ");
      channel.send({ content: msg }).catch((e: unknown) => { console.error(e); });
    } else {
      msg = args.join(" ");
      message.channel.send({ content: msg }).catch((e: unknown) => { console.error(e); });
    }
  }
}