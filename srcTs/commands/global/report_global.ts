import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { setReport } from "@util/commands/report";
import type { Message } from "discord.js";

export default class Report extends BaseCommand<"command"> {
  constructor() {
    super({
      name: "report",
      commandType: "command",
      option: {
        aliases: ["репорт"],
        delete: true,
      },
      //description: "Пожаловаться на другого пользователя",
    });
  }

  async execute(
    message: Message,
    args: string[],
    commandName: string,
    client: EmiliaClient,
  ) {
    if (
      message.guildId !== "451103537527783455" ||
      !message.guild ||
      !message.member
    )
      return; //пока будет только для бункера. Мб позже сменю

    const reportUser =
      message.mentions.members?.first() ||
      message.guild.members.cache.get(args[0]);
    const reportReason = args.slice(1).join(" ");

    setReport({ mesInt: message, reporter: message.member, reported: reportUser, report: reportReason });
  }
}
