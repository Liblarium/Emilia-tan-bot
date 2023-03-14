const { SlashCommandBuilder } = require(`discord.js`);
const { clientId, reportId } = require(`${process.cwd()}/config.js`).config_client;
module.exports = {
    data: new SlashCommandBuilder()
    .setName(`report`)
    .setDescription(`Пожаловаться на пользователя`)
    .addUserOption(option => option.setName(`пользователь`).setDescription(`Выбор пользователя, на которого будет жалоба`).setRequired(true))
    .addStringOption(option => option.setName(`жалоба`).setDescription(`Опишите причину жалобы. Больше 4к символов не принимаю.`).setRequired(true)),
    async execute (interaction, emilia) {
    const users = interaction.options.getUser(`пользователь`);
    const string = interaction.options.getString(`жалоба`);
    let colors;
    if (string.length >= 4001) return interaction.reply({ embeds: [{
        title: `Жалоба на пользователя`,
        description: `Ваша жалоба имеет более 4к символов (${string.length})`,
        color: parseInt(`ff2500`, 16),
        footer: {
            text: `В следующий раз введите жалобу по меньше`,
        },
    }],
        ephemeral: true
    });
    if (users.id === interaction.member.user.id) return interaction.reply({ embeds: [{
        title: `Жалоба на пользователя`,
        description: `Пожаловаться на самого себя низя. Бака`,
        color: parseInt(`ff2500`, 16),
        footer: {
            text: `Хорошая попытка, но недостаточно хороша.`,
            iconURL: interaction.guild.members.cache.get(clientId).displayAvatarURL({ dynamic: true}),
        },
    }],
        ephemeral: true,
    });
    if (string.length <= 4000) {
        if (new Number(interaction.member.displayColor) == 0) { colors = parseInt(`ff2500`, 16) } else if (new Number(interaction.member.displayColor) != 0) { colors = interaction.member.displayColor; }
        interaction.guild.channels.cache.get(reportId).send({ embeds: [{
            author: {
                name: `${interaction.member.user.tag}`,
                iconURL: interaction.member.displayAvatarURL({ dynamic: true}), 
            },
            title: `Жалоба на пользователя`,
            description:`${string}`,
            fields: [
                { name: `Пожаловался:`, value: `${interaction.member} (${interaction.member.user.tag})`, inline: true },
                { name: `В канале:`, value: `${interaction.channel} (${interaction.channel.name})`, inline: true },
                { name: `\u200b`, value: `\u200b`, inline: true },
                { name: `Жалоба на:`, value: `${users} (${users.username}#${users.discriminator})`, inline: true},
                { name: `ID пользователя:`, value: `${users.id}`, inline: true },
            ],
            color: colors,
            footer: {
                text: `ID жалующегося: ${interaction.member.user.id}`,
                iconURL: interaction.guild.iconURL({ dynamic: true }),
            },
            timestamp: new Date(),
        }]});
        interaction.reply({embeds: [{
            title: `Жалоба на пользователя`,
            description: `Ваша жалоба была успешно доставлена.`,
            color: parseInt(`25ff00`, 16),
        }],
            ephemeral: true,
        })
    }
    }
}