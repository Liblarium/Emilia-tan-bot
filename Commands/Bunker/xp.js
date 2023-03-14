const { conErr } = require(`../../config.js`);

module.exports = {
    name: `xp`,
    aliases: [],
    option: {
        type: `command`,
        delete: true,
        private: true,
    },
    async execute (message, args, commandName, emilia) {
        const { database } = require(`./../../Database/database.js`);
        let usr = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!usr) usr = message.member;
        database.fetchData(`id`, `${usr?.user?.id}`, `users`, us => {
            if (us === undefined) return conErr(`${commandName}`, `Произошла ошибка при проверке юзера в БД!`);
            message.channel.send({embeds: [{
                title: `${usr.displayName}`,
                description: `Уровень: **${us?.level || `-0`}**\nОпыт: **${us?.xp || `-0`}**/**${us?.max_xp || `-0`}**\nЛимит: **${us?.day_xp || `-0`}**/**75**\nСообщений: **${us?.mes_size || `-0`}**/**20**`,
                footer: {
                    text: `-0 это не ошибка, а человек вне БД.\nОн появится в БД после любого сообщения в чате`
                }    
            }],
        });
    });
    }
}