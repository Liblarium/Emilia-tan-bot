const { conErr, conLog } = require(`../../config.js`);
const { database } = require(`../../Database/database.js`);

module.exports = {
    name: `potion`,
    aliases: [],
    option: {
        type: `command`,
        delete: true,
        test: true,
        testers: [`477456988817719307`],
        private: true,
    },
    description: `Изменение возможности становление чтецом`,
    async execute (message, args, commandName, emilia) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let n, min, max;
        if (message.member.user.id == `211144644891901952`) min = -1, max = 100; else min = 0, max = 100;
        if (args[1]) n = parseInt(args[1]);
        if (member) {
        if (member.roles.cache.has(`748102803741736960`) || member.user.bot) return message.channel.send({content: `Низя изменить значение для чтеца (ур доступа) или бота!`})
    database.fetchData(`id`, `${member.user.id}`, `users`, usr => {
        if (usr === undefined) return conErr(`${commandName}`, `Произошла ошибка при проверке юзера в БД!`);
        if (usr === null) return conErr(`${commandName}`, `Юзера не оказалось в БД!`), this.option.delete = false, message.react(`❌`).catch(err => conErr(`${commandName}`, err));
            if (args[1]) {
            if (usr?.potion > -1 && usr?.potion < 100) {
            if (n == usr?.potion) return message.channel.send({content: `У этого пользователя уже стоит это значение!`});
            if (isNaN(n)) return message.channel.send({content: `${n} не есть числом!`}), conErr(`${commandName}`, `Введенное значение ${n} не является числом!`); 
            if (n < min && n > max) return message.channel.send({content: `Число ${n < min ? `${n} меньше минимального` : ``}${n > max ? `${n} больше максимального` : ``}`});
            database.updatePartialData(member.user.id, { potion: n }, `users`, up => {
                if (up === undefined) return conErr(`${commandName}`, `Произошла ошибка при обновлении данных в БД!`);
                if (typeof up != `object`) return conErr(`${commandName}`, `up is not a object!`);
                conLog(`${commandName}`, `${member.user.tag} имеет ${n} "баллов" сейчас.`);
                message.channel.send({content: `Сделано.`});
            });
            } else if (usr?.potion == -1 && message.member.id == `211144644891901952` || usr?.potion == 100 && message.member.id == `211144644891901952`) {
                if (n == usr?.potion) return message.channel.send({content: `Низя просто взять и выдать то же самое количество`});
            database.updatePartialData(member.user.id, { potion: n }, `users`, up => {
                if (up === undefined) return conErr(`${commandName}`, `Произошла Ашибка при обновлении данных в БД!`);
                if (typeof up != `object`) return conErr(`${commandName}`, `up very not object`);
                conLog(`${commandName}`, `${member.user.tag} имеет ${n} "балов" сейчас.`);
                message.channel.send({content: `Сделано.`});
            });
            } else {
                message.channel.send({content: `Если ты хочешь изменить юзера с 100 или -1, то тыкай Мию.`});
            }
        } else message.channel.send({embeds: [{
            title: `"Карточка" Пользователя`,
            description: `Пользователь: ${member}\n"очки": ${usr?.potion}/100`,
            footer: {
                text: `-1 - это вне допуска. 100 - кандидат в чтецы ур доступа`,
            },
        }],
    });
    });
        }
    }
}