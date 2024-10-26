import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import type { GuildPrefix } from "@type/command";
import { parseJsonValue, prefix } from "@util/s";
import type { ChatInputCommandInteraction } from "discord.js";

export default class Prefix_s extends BaseCommand {
  constructor() {
    super({
      name: "prefix",
      option: {
        type: "slash",
      },
      description: "Просмотр префикса бота",
    });

    this.data.addStringOption((option) =>
      option
        .setName("prefix")
        .setDescription("Новый префикс")
        .setRequired(false),
    );
  }

  async execute(
    interaction: ChatInputCommandInteraction,
    client: EmiliaClient,
  ) {
    if (!interaction.guildId || !interaction.guild) return;

    const newPrefix = interaction.options.getString("prefix");
    const guildId = BigInt(interaction.guildId);
    let guildConfig = await client.db.guild.findFirst({
      where: { id: guildId },
      select: { prefix: true },
    });
    let isLocal = false;

    if (!guildConfig) {
      isLocal = true;
      guildConfig = {
        prefix: {
          default: prefix,
          now: prefix,
        },
      };
    }

    if (!newPrefix)
      return interaction.reply({
        embeds: [
          {
            title: "Префикс бота",
            description: `Установленный на сервер префикс: **${parseJsonValue<GuildPrefix>(guildConfig.prefix).now}**. Стандартный префикс: **${prefix}**`,
            color: 0x25_ff_00,
          },
        ],
        ephemeral: true,
      });

    if (newPrefix && interaction.guild.ownerId === interaction.user.id) {
      if (isLocal)
        return interaction.reply({
          content:
            "При получении информации о гильдии - гильдия не была найдена в БД) (Возможно её нет в БД)",
          ephemeral: true,
        });
      if (newPrefix.length >= 6)
        return interaction.reply({
          content:
            "Префикс не может быть больше 5 символов! (Такой префикс был установлен, дабы людям не нужно было вводить километровый префикс)",
          ephemeral: true,
        });

      const updatePrefix = await client.db.guild.update({
        where: { id: guildId },
        data: { prefix: { default: prefix, now: newPrefix } },
        select: { prefix: true },
      });

      if (!updatePrefix.prefix)
        return interaction.reply({
          content:
            "Произошла ошибка при обновлении префикса в БД! (Попробуй ещё раз. Если не работает - тыкайте Мию)",
          ephemeral: true,
        });

      return interaction.reply({
        embeds: [
          {
            title: "Префикс бота",
            description: `Установленный на сервер префикс: **${newPrefix}**. Стандартный префикс: **${prefix}**`,
            color: 0x25_ff_00,
          },
        ],
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: "Ты не имеешь власти над этой командой ;D",
      ephemeral: true,
    });
  }
}
