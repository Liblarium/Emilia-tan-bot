module.exports = {
    name: `clan_profile`,
    aliases: [`orden_profile`, `sect_profile`, `cult_profile`],
    option: {
        type: `command`,
        delete: true,
        test: true,
        testers: [`310396577644806154`], //позже добавлю
        private: true //только для бункера
    },
    description: `Просмотр профиля клана/ордена/секты/культа`,
    async execute (message, args, commandName, emilia) {
        const { conErr } = require(`${process.cwd()}/config.js`);
        const { database } = require(`${process.cwd()}/Database/database.js`);
        if (message.channel.id !== `829421957891489825`) return console.log(`не тот канал`);
    database.fetchData(`id`, `${message.member.user.id}`, `users`, usr => {
        if (usr === undefined) return conErr(commandName, `Ошибка при проверке человека в БД (0)[0]`);
        if (usr === null) return message.channel.send({content: `Вас нет в Базе Данных!`});
        if (usr?.name_chan == `Не состоит`) return message.channel.send({content: `Вас нет в клане/ордене/секте/культе`});
    database.fetchData(`g_name`, `${usr?.name_clan}`, `кланы`, clan => {
        if (clan === undefined) return conErr(commandName, `Ошибка при проверке наличия клана в БД (0)[1]`);
        if (clan === null) return message.channel.send({content: `Похоже вашего ${usr.type_clan} нет в этой БД.`}), conErr(commandName, `Была потрачена одна из ${usr.type_clan} (1)[1]`);
        message.channel.send({content: `Имя: ${clan.g_name}, Тип: ${clan.types}, уровень: ${clan.lvl}, состоит людей: ${JSON.parse(clan.members).members.length}, ваша позиция: ${usr.positions}`});
    }); //БД кланов
    }); //БД профиля
    }
}