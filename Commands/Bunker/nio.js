const { conErr } = require(`${process.cwd()}/config.js`);
const { clientId } = require(`${process.cwd()}/config.js`).config_client;
module.exports = {
    name: `newinfo`,
    aliases: [`nio`],
    option: {
        type: `command`,
        delete: true,
        perms: 0,
    },
    description: `Изменение информации о себе`,
    async execute (message, args, commandName, emilia) {
    const { database } = require(`${process.cwd()}/Database/database.js`);
    database.fetchData(`id`, `${message.member.user.id}`, `users`, usr => {
        if (usr === undefined) return conErr(`${commandName}`, `Ошибка при проверке на наличие пользователя в БД! (0)[0]`);
        if (usr === null) return message.channel.send({embeds: [{
            title: `Обновление информации о себе`,
            description: `Похоже вас нет в Базе Данных`,
            color: parseInt(`ff2500`, 16),
            footer: {
                text: `Эта команда доступна только для пользователей, что есть в Базе Данных`,
                iconURL: message.guild.members.cache.get(clientId).displayAvatarURL({ dynamic: true}),
            }
        }]});
        if (!args || args.length <= 0) return message.channel.send({embeds: [{
            title: `Обновление информации о себе`,
            description: `Вы ничего не ввели, дабы изменить информацию о себе`,
            color: parseInt(`ff2500`, 16),
        }]});
        if (args.length >= 1025) return message.channel.send({embeds: [{
            title: `Обновление информации о себе`,
            description: `Больше 1024 (${args.length}) я не принимаю.`,
            color: parseInt(`ff2500`, 16),
            footer: {
                text: `Попробуйте написать по меньше информации о себе`,
                iconURL: message.guild.members.cache.get(clientId).displayAvatarURL({ dynamic: true}),
            }
        }]});
    if (args.length <= 1024) {
    database.updatePartialData(message.member.id, { info: `${args.join(` `)}`}, `users`, upUsr => {
        if (upUsr === undefined) return conErr(`${commandName}`, `Ошибка при обновлении информации о пользователе (0)[1]`);
        if (typeof upUsr != `object`) return conErr(`${commandName}`, `Записываемый предмет оказался не объектом (1)[1]`);
        message.channel.send({embeds: [{
            title: `Обновление информации о себе`,
            description: `Ваша информации о себе была обновлена.`,
            color: parseInt(`25ff00`, 16),
            footer: {
                text: `Размер нового описания о себе: ${args.join(` `).length}`,
            }
        }]});
    }); //Обновление информации о себе в БД 
    }
    }); //БД профиля
    }
}