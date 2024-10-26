import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { helpList, helpName } from "@util/help.list";
import { prefix } from "@util/s";
import { type ChatInputCommandInteraction, GuildMember } from "discord.js";

export default class Help_s extends BaseCommand {
  constructor() {
    super({
      name: "help",
      option: {
        type: "slash",
      },
      description: "Посмотреть список команд",
    });

    this.data.addStringOption((option) =>
      option
        .setName("команда")
        .setDescription("Глянуть на описание команды")
        .setRequired(false),
    );
  }

  async execute(
    interaction: ChatInputCommandInteraction,
    client: EmiliaClient,
  ) {
    if (!interaction.member || !interaction.guild || !interaction.guildId || !(interaction.member instanceof GuildMember)) return;

    const author = {
      name: interaction.member.displayName,
      icon_url: interaction.member.displayAvatarURL({ forceStatic: false }),
    };
    const color = interaction.member.displayColor === 0 ? 0x48_df_bf : interaction.member.displayColor;
    const whyCommand = interaction.options.getString("команда");
    const guildConfig = await client.db.guild.findFirst({ where: { id: BigInt(interaction.guildId) }, select: { prefix: true } });
    const defaultPrefix = { default: prefix, now: prefix };

    const guildPrefix = guildConfig === null ? defaultPrefix : guildConfig.prefix === null ? defaultPrefix : JSON.parse(guildConfig.prefix.toString());

    if (whyCommand) {
      const command = helpList.get(whyCommand);

      if (!command) return await interaction.reply({
        embeds: [{
          author,
          color: 0xff_25_00,
          description: `К сожалению - **${whyCommand}** не был(а) найдена`,
          footer: {
            text: `Введите ${guildPrefix.now}help для просмотра списка команд)`
          }
        }],
        ephemeral: true
      });

      return await interaction.reply({
        embeds: [{
          author,
          color,
          description: `Имя команды: **${command.name}**\nОписание: ${command.text}${command.aliases.length > 0 ? `Альтернативные названия для вызова этой команды: ${command.aliases.map(i => `**${i}**`).join(", ")}` : ""}`
        }],
        ephemeral: true
      });

    }
    return await interaction.reply({
      embeds: [{
        author,
        color,
        description: `Список доступных команд: \n${helpName.map(i => `${prefix}**${i}**`).join(", ")}`,
      }]
    });
  }
}
