const { conErr } = require(`${process.cwd()}/config.js`);
const { prefix } = require(`${process.cwd()}/config.js`).config_client;
module.exports = {
    name: `prefix`,
    aliases: [`префикс`],
    option: {
        type: `command`,
        delete: true,
        perms: 0,
    },
    description: `Просмотр префикса бота. Если вы овнер сервера - изменение префикса для сервера`,
    async execute (message, args, commandName, emilia) {
    const { database } = require(`${process.cwd()}/Database/database.js`);
    database.fetchData(`guID`, `${message.guild.id}`, `guild_setting`, st => {
        if (st === undefined) return conErr(`${commandName}`, `Ошибка при проверке сервера в БД! (0)[0]`);
        let pref;
        if (st === null) pref = prefix;
        if (st !== null) pref = st.pref;
        if (args[0] && message.author.id == message.guild.ownerId) {
            if (st === null) return message.chanel.send({embeds: [{
                title: `Смена префикса`,
                description: `Ваш сервер не находится в Базе Данных. Обратитесь к создателю бота по этому поводу.`,
                color: parseInt(`ff2500`, 16),
            }]});
            if (args[0].length >= 6) return message.channel.send({embeds: [{
                title: `Смена префикса`,
                description: `Максимальный размер префикса - 5. Такой размер был установлен, дабы людям не нужно было вводить километровый префикс.`,
                footer: {
                    text: `Размер вашего префикса: ${args[0].length}`,
                }
            }]});
        database.updatePartialData(st.id, { pref: `${args[0]}` }, `guild_setting`, upSt => {
            if (upSt === undefined) return conErr(`${commandName}`, `Ошибка при записи нового префикса (0)[1]`);
            if (typeof upSt != `object`) return conErr(`${commandName}`, `Записываемый предмет оказался не object (1)[1]`);
            message.channel.send({embeds: [{
                title: `Смена префикса`,
                description: `Новый префикс ${args[0]} установлен.`,
                color: parseInt(`25ff00`, 16),
                footer: {
                    text: `Стандартный префикс: ${prefix}. Размер нового префикса: ${args[0].length}`,
                },
            }]});
        });// Обновление записи в БД настройки сервера
        } else {
            message.channel.send({embeds: [{
                title: `Префикс бота`,
                description: `Установленный префикс бота: **${pref}**, стандартный префикс: ${prefix}`,
                color: parseInt(`25ff00`, 16),
                footer: {
                    text: `Владелец сервера может сменить префикс для сервера`,
                }
            }]});
        }
    }); // БД настройки сервера
    }
}