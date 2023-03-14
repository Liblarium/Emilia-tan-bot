const { conErr } = require(`${process.cwd()}/config.js`);

module.exports = {
    name: `pol`,
    aliases: [],
    option: {
        type: `command`,
        delete: true,
        perms: 0,
    },
    description: `Изменение пола в профиле/просмотр вашего пола в профиле`,
    async execute (message, args, commandName, emilia) {
    if (message.guild.id != `451103537527783455`) return;
    const { database } = require(`${process.cwd()}/Database/database.js`);
    const userPol = await database.fetchDataAsync(`id`, `${message.member.user.id}`, `users`);
    if (userPol === undefined) return conErr(`Пол`, `Ошибка проверки юзера в БД (0)[0]`);
    if (userPol === null) return message.channel.send({content: `Похоже вас нет в Базе Данных.`}), conErr(`Пол`, `${message.member.user.tag} не оказалось в БД! (1)[0]`);
    message.channel.send({content: `Пол: ${userPol?.pol}. P.S. Эта команда будет изменена, если что`});
    }
};