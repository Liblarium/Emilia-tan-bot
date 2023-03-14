const { clientId, reportId, guildId } = require(`${process.cwd()}/config.js`).config_client;
module.exports = {
    name: `report`,
    aliaes: [`репорт`],
    option: {
        type: `command`,
        delete: true,
        perms: 0,
    },
    description: `Пожаловаться на другого пользователя`,
    async execute (message, args, commandName, emilia) {
    if (message.guild.id != guildId) return;
    const reports = message.mentions.members.first() || message.guild.members.cache.find(m => m.id === args[0]);
    let colors;
    if (!reports || !args[0] == reports) return message.channel.send({embeds: [{
        title: `Жалоба на пользователя`,
        description: `Вы не указали (упомянули) пользователя, на которого будете жаловаться (или введенный ID был не верен)`,
        color: parseInt(`ff2500`, 16),
        footer: {
            text: `Попробуйте снова, но в этот раз гляньте по лучше`,
        }
    }]});
    if (!args.slice(1).join(` `)) return message.channel.send({embeds: [{
        title: `Жалоба на пользователя`,
        description: `Вы не указали причину жалобы`,
        color: parseInt(`ff2500`, 16),
        footer: {
            text: `Причина жалобы обязательна.`,
        }
    }]});
    if (reports.user.id === message.author.id) return message.channel.send({embeds: [{
        title: `Жалоба на пользователя`,
        description: `Пожаловаться на себя низя. Бака`,
        color: parseInt(`ff2500`, 16),
        footer: {
            text: `Хорошая попытка, но недостаточно хороша.`,
            iconURL: message.guild.members.cache.get(clientId).displayAvatarURL({ dynamic: true}),
        },
    }]});
    if (args.length >= 4001) return message.channel.send({embeds: [{
        title: `Жалоба на пользователя`,
        description: `Жалоба не может иметь больше 4к символов!`,
        color: parseInt(`ff2500`, 16),
        footer: {
            text: `Я не знаю как у тебя получилось вызвать эту ошибку, но напиши жалобу по меньше`,
            iconURL: message.guild.members.cache.get(clientId).displayAvatarURL({ dynamic: true}),
        }
    }]});
    if (args.length <= 4000) {
        if (new Number(message.member.displayColor) == 0) { colors = parseInt(`ff2500`, 16) } else if (new Number(message.member.displayColor) != 0) { colors = message.member.displayColor; }
        message.channel.send({ embeds: [{
            title: `Жалоба на пользователя`,
            description: `Жалоба была доставлена!`,
            color: parseInt(`25ff00`, 16),
        }]});
        message.guild.channels.cache.get(reportId).send({embeds: [{
            title: `Жалоба на пользователя`,
            description: `${args.slice(1).join(` `)}`,
            color: colors,
            fields: [
                { name: `Пожаловался:`, value: `${message.member} (${message.member.user.tag})`, inline: true },
                { name: `В канале:`, value: `${message.channel} (${message.channel.name})`, inline: true },
                { name: `\u200b`, value: `\u200b`, inline: true },
                { name: `Жалоба на:`, value: `${reports} (${reports.user.tag})`, inline: true},
                { name: `ID пользователя:`, value: `${reports.user.id}`, inline: true },
            ],
            footer: {
                text: `ID жалующегося: ${message.member.user.id}`,
                iconURL: message.guild.iconURL({dynamic: true}),
            },
            timestamp: new Date(),
        }]});
    }
    }
}