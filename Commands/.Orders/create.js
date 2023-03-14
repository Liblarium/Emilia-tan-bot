const { conLog, conErr } = require(`../../config.js`);
module.exports = {
    name: `create`,
    aliases: [],
    option: {
        type: `command`,
        delete: true,
        test: true,
        testers: [`310396577644806154`], //добавлю позже
        private: true, //только для бункера
    },
    description: `Создание культа/ордена/секты или клана`,
    async execute (message, args, commandName, emilia) {
    const { database } = require(`../../Database/database.js`); 
    let colors;
    if (message.channel.id !== `829421957891489825`) return conErr(commandName, `не тот канал`);
    database.fetchData(`id`, `${message.member.user.id}`, `users`, usr => {
        if (usr === undefined) return conErr(commandName, `Произошла ошибка при проверке юзера в БД! (0)[0]`);
        if (usr === null) return conErr(commandName, `Юзера не оказалось в БД! (1)[0].`), message.channel.send({content: `Вас нет в базе данных. Эта команда вам недоступа.`});
        if (usr?.name_clan == `Не состоит`) {
            message.channel.send({content: `Тыкни на кнопку`, components: [{
                type: 1,
                components: [{
                    type: 2,
                    custom_id: `o.but_create`,
                    style: 2,
                    label: `Тыкни на меня`,
                }],
            }],
        })
        } else {
            if (new Number(inMember.user.displayColor) == 0) { colors = parseInt(`48dfbf`, 16) } else if (new Number(inMember.user.displayColor) != 0) { colors = inMember.user.displayColor; }
            message.channel.send({embeds: [{
                title: `${usr?.type_clan} ${usr?.name_clan}`,
                description: `Ваше положение: ${usr?.positions}`,
                color: colors,
            }],
        });
        }
    });
    }
};
