import { BaseCommand } from "@base/command";
import type { EmiliaClient } from "@client";
import { db } from "@database";
import { users } from "@schema/user";
import { type ChatInputCommandInteraction, GuildMember } from "discord.js";
import { eq } from "drizzle-orm";

export default class NewInfo_s extends BaseCommand {
  constructor() {
    super({
      name: "newinfo",
      option: {
        type: "slash"
      },
      description: "Установить новую информацию о себе",
    });

    this.data
      .addStringOption((option) =>
        option
          .setName("обновление")
          .setDescription("Текст больше 1024 символов не принимается")
          .setMaxLength(1024)
          .setRequired(true)
      );
  }

  async execute(interaction: ChatInputCommandInteraction, client: EmiliaClient) {
    if (!(interaction.member instanceof GuildMember) || !interaction.guild) return;

    const userId = BigInt(interaction.member.user.id);
    const newInfo = interaction.options.getString("обновление", true);
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId), columns: { bio: true }
    });
    const title = "Обновление информации о себе";
    const icon_url = interaction.member.displayAvatarURL({ forceStatic: false });

    if (!user) return interaction.reply({
      embeds: [{
        title,
        description: "Похоже что-то пошло не так. Попробуйте ещё раз или обратитесь к Мии.",
        color: 0xff_25_00,
        footer: {
          text: "\u200b",
          icon_url
        }
      }], ephemeral: true
    });
    if (newInfo.length >= 1025) return interaction.reply({ content: `Текст (${newInfo.length}) больше 1024 символов не принимается`, ephemeral: true });

    const updateBio = await db
      .update(users)
      .set({ bio: newInfo })
      .where(eq(users.id, userId))
      .returning({ bio: users.bio });

    if (updateBio.length < 1) return await interaction.reply({ content: "Похоже что-то пошло не так. Попробуйте ещё раз или обратитесь к Мии.", ephemeral: true });

    await interaction.reply({ embeds: [{ title, description: "Ваша информация обновлена. Можете глянуть с помощью </profile:1018822028565946379> ", color: 0x25_ff_00, footer: { text: `Размер нового описания: ${newInfo.length}`, icon_url } }], ephemeral: true });
  }
}
