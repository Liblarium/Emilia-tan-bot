import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { editPol } from "@util/commands/pol";
import { isGuildMember } from "@util/s";
import type { Message } from "discord.js";

export default class Pol extends BaseCommand {
  constructor() {
    super({
      name: "pol",
      commandType: "command",
      option: {
        delete: true,
      },
      description: "Изменение пола в профиле/просмотр вашего пола в профиле",
    });
  }

  async execute(message: Message, args: string[], commandName: string, client: EmiliaClient) {
    if (!message.guildId || !isGuildMember(message.member) || message.channel.isDMBased()) return;
    //if (message.guildId !== "451103537527783455") return;

    const polMessage = await editPol({ id: message.author.id, pol: args.join(" "), color: message.member.displayColor });

    return message.channel.send({ embeds: [polMessage] });
  }
}

