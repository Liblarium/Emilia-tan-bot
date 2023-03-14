const { time } = require(`${process.cwd()}/config.js`);
module.exports = {
    name: `time`,
    aliases: [`время`],
    option: {
        type: `command`,
        delete: true,
        perms: 0,
    },
    description: `Глянуть на время хоста`,
    async execute (message, args, commandName, emilia) {
        let colors;
        if (new Number(message.member.user.displayColor) == 0) { colors = parseInt(`48dfbf`, 16) } else if (new Number(message.member.user.displayColor) != 0) { colors = message.member.user.displayColor; }
        message.channel.send({embeds: [{
            title: `Время:`,
            description: `Сейчас у хоста: **${time()}**`,
            timestamp: new Date(),
            color: colors,
            footer: {
                text: `\u200b`, 
                iconURL: message.member.displayAvatarURL({ dynamic: true}),
            }
        }]});
    }
}