module.exports = {
    name: `help`,
    aliases: [`помощь`, `command`, `команды`, `хелп`],
    option: {
        type: `command`,
        delete: true,
        perms: 0,
    },
    description: `Команда для просмотра списка доступных команд`,
    async execute (message, args, commandName, emilia) {
        const { database } = require(`${process.cwd()}/Database/database.js`);
        const { help_list } = require(`${process.cwd()}/Files/help.js`);
        const { conErr } = require(`${process.cwd()}/config.js`);
        const { prefix } = require(`${process.cwd()}/config.js`).config_client;
        database.fetchData(`guID`, `${message.guild.id}`, `guild_setting`, st => {
            if (st === undefined) return conErr(`${commandName}`, `Ошибка при проверка на наличие сервера в БД! (0)[0]`);
            let pref = st.pref;
            pref ??= prefix;
            let colors;
            let help_status;
            if (new Number(message.member.displayColor) == 0) { colors = parseInt(`48dfbf`, 16) } else if (new Number(message.member.displayColor) != 0) { colors = message.member.displayColor; }
            const lsit = (text) => {
                if ([`help`, `помощь`, `команды`, `хелп`, `command`, `profile`, `pr`, `newinfo`, `nio`, `time`, `шар`, `report`, `репорт`, `channel`, `канал`, `prefix`, `pre_set`, `ping`, `p`, `пинг`, `xp`].includes(text)) {
                    help_status = parseInt(`25ff00`, 16);
                    if (text == `help`) {
                        return help_list.help;
                    }
                    if (text == `помощь`) {
                        return help_list.помощь;
                    }
                    if (text == `команды`) {
                        return help_list.команды;
                    }
                    if (text == `хелп`) {
                        return help_list.хелп;
                    }
                    if (text == `command`) {
                        return help_list.commands;
                    }
                    if (text == `profile`) {
                        return help_list.profile;
                    }
                    if (text == `pr`) {
                        return help_list.pr;
                    }
                    if (text == `newinfo`) {
                        return help_list.newinfo;
                    }
                    if (text == `nio`) {
                        return help_list.nio;
                    }
                    if (text == `time`) {
                        return help_list.time;
                    }
                    if (text == `шар`) {
                        return help_list.шар;
                    }
                    if (text ==  `report`) {
                        return help_list.report;
                    }
                    if (text == `репорт`) {
                        return help_list.репорт;
                    }
                    if (text == `channel`) {
                        return help_list.channel;
                    }
                    if (text == `канал`) {
                        return help_list.канал;
                    }
                    if (text == `prefix`) {
                        return help_list.prefix;
                    }
                    if (text == `pre_set`) {
                        return help_list.pre_set;
                    }
                    if (text == `ping`) {
                        return help_list.ping;
                    }
                    if (text == `p`) {
                        return help_list.p;
                    }
                    if (text == `пинг`) {
                        return help_list.пинг;
                    }
                    if (text == `xp`) {
                        return help_list.xp;
                    }
                } else {
                    help_status = parseInt(`ff2500`, 16);
                    return `Увы - такой команды нет`;
                }
            }
            if (!args[0]) {
                message.channel.send({embeds: [{ title: `Список доступных команд:`, 
                    author: {
                        name: `${message.member.displayName}`,
                        iconURL: message.member.displayAvatarURL({ dynamic: true}),
                    },
                    description: `${pref}**help**, ${pref}**newinfo**, ${pref}**profile**, ${pref}**time**, ${pref}**шар**, ${pref}**report**, ${pref}**channel**(пока нет), ${pref}**prefix**, ${pref}**ping**, **${pref}xp**\n </хелп:1027277375123230827>, </newinfo:1027277375123230822>, </profile:1027277375123230824>, </time:1027277375123230826>, </шар:1027277375123230828>, </report:1027277375123230825>, (/ команды channel нет), </prefix:1027277375123230823>, </пинг:1018117173056638986>`,
                    color: colors,
                    footer: {
                        text: `Некоторые комманды могут быть вне этого списка (и это не баг)`,
                        iconURL: message.guild.iconURL({dynamic: true}),
                        }
                    }], 
                });
            } else {
                if ([`help`, `помощь`, `команды`, `хелп`, `command`, `profile`, `pr`, `newinfo`, `nio`, `time`, `шар`, `report`, `репорт`, `channel`, `канал`, `prefix`, `pre_set`, `ping`, `p`, `пинг`, `xp`].includes(args[0])) {
                    message.channel.send({embeds: [{
                        title: `${args[0]}`,
                        description: `${lsit(args[0])}`,
                        color: help_status,
                        footer: {
                            text: `Префикс на сервере: ${pref}`,
                            }
                        }], 
                    });
                } else {
                    message.channel.send({embeds: [{
                        title: `${args[0]}`,
                        description: `${lsit(args[0])}`,
                        color: help_status,
                        footer: {
                            text: `Посмотрите в список комманд по лучше. А если оно там есть, но выдало это сообщение - обратитесь к ${emilia.members?.cache?.get(`211144644891901952`)?.user?.tag || message.guild.members?.cache?.get(`211144644891901952`)?.user?.tag || `создателю бота`} и сделайте скрин моего ответа.`,
                            }
                        }], 
                    });
                }
            }
        }); // БД настройки сервера
    }
}
