const { SlashCommandBuilder } = require(`discord.js`);
const { conErr, config_client } = require(`../../config.js`);
const { prefix } = config_client;
module.exports = {
    data: new SlashCommandBuilder()
    .setName(`хелп`)
    .setDescription(`Посмотреть список команд`)
    .addStringOption(option => option.setName(`команда`).setDescription(`Глянуть на описание команды`)),
    async execute (interaction, emilia) {
    const { database } = require(`../../Database/database.js`);
    const { help_list } = require(`../../Files/help.js`);
    database.fetchData(`guID`, `${interaction.guild.id}`, `guild_setting`, st => {
        if (st === undefined) return conErr(`${interaction.commandName} (/)`, `Ошибка при проверка на наличие сервера в БД! (0)[0]`);
        let pref = st.pref;
        pref ??= prefix;
        const string = interaction.options.getString(`команда`);
        let colors;
        let help_status;
        if (new Number(interaction.member.displayColor) == 0) { colors = parseInt(`48dfbf`, 16) } else if (new Number(interaction.member.displayColor) != 0) { colors = interaction.member.displayColor; }
        const lsit = (text) => {
            if ([`help`, `помощь`, `команды`, `хелп`, `command`].includes(text)) {
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
            }
            if ([`profile`, `pr`].includes(text)) {
                help_status = parseInt(`25ff00`, 16);
                if (text == `profile`) {
                    return help_list.profile;
                }
                if (text == `pr`) {
                    return help_list.pr;
                }
            }
            if ([`newinfo`, `nio`].includes(text)) {
                help_status = parseInt(`25ff00`, 16);
                if (text == `newinfo`) {
                    return help_list.newinfo;
                }
                if (text == `nio`) {
                    return help_list.nio;
                }
            }
            if (text == `time`) {
                help_status = parseInt(`25ff00`, 16);
                return help_list.time;
            }
            if (text == `шар`) {
                return help_list.шар;
            }
            if ([`report`, `репорт`].includes(text)) {
                help_status = parseInt(`25ff00`, 16);
                if (text ==  `report`) {
                    return help_list.report;
                }
                if (text == `репорт`) {
                    return help_list.репорт;
                }
            }
            if ([`channel`, `канал`].includes(text)) {
                help_status = parseInt(`25ff00`, 16);
                if (text == `channel`) {
                    return help_list.channel;
                }
                if (text == `канал`) {
                    return help_list.канал;
                }
            }
            if ([`prefix`, `pre_set`].includes(text)) {
                help_status = parseInt(`25ff00`, 16);
                if (text == `prefix`) {
                    return help_list.prefix;
                }
                if (text == `pre_set`) {
                    return help_list.pre_set;
                }
            }
            if ([`ping`, `p`, `пинг`].includes(text)) {
                help_status = parseInt(`25ff00`, 16);
                if (text == `ping`) {
                    return help_list.ping;
                }
                if (text == `p`) {
                    return help_list.p;
                }
                if (text == `пинг`) {
                    return help_list.пинг;
                }
            }
            if ([`xp`].includes(text)) {
                help_status = parseInt(`22ff00`, 16);
                if (text == `xp`) {
                    return help_list.xp;
                }
            }
            if (![`help`, `помощь`, `команды`, `хелп`, `command`, `profile`, `pr`, `newinfo`, `nio`, `time`, `шар`, `report`, `репорт`, `channel`, `канал`, `prefix`, `pre_set`, `ping`, `p`, `пинг`, `xp`].includes(text)) {
                help_status = parseInt(`ff2500`, 16);
                return `Увы - такой команды нет`;
            }
        }
        if (!string) {
            interaction.reply({embeds: [{ title: `Список доступных команд:`, 
                author: {
                    name: `${interaction.member.displayName}`,
                    iconURL: interaction.member.displayAvatarURL({ dynamic: true}),
                },
                description: `${pref}**help**, ${pref}**newinfo**, ${pref}**profile**, ${pref}**time**, ${pref}**шар**, ${pref}**report**, ${pref}**channel**(пока нет), ${pref}**prefix**, ${pref}**ping**, **${pref}xp**\n </хелп:1027277375123230827>, </newinfo:1027277375123230822>, </profile:1027277375123230824>, </time:1027277375123230826>, </шар:1027277375123230828>, </report:1027277375123230825>, (/ команды channel нет), </prefix:1027277375123230823>, </пинг:1018117173056638986>`,
                color: colors,
                footer: {
                    text: `Некоторые комманды могут быть вне этого списка (и это не баг)`,
                    iconURL: interaction.guild.iconURL({dynamic: true}),
                }}], 
                ephemeral: true
            });
        } else {
            if ([`help`, `помощь`, `команды`, `хелп`, `command`, `profile`, `pr`, `newinfo`, `nio`, `time`, `шар`, `report`, `репорт`, `channel`, `канал`, `prefix`, `pre_set`, `ping`, `p`, `пинг`, `xp`].includes(string)) {
                interaction.reply({embeds: [{
                    title: `${string}`,
                    description: `${lsit(string)}`,
                    color: help_status,
                    footer: {
                        text: `Префикс на сервере: ${pref}`,
                    }
                }], 
                    ephemeral: true
                });
            } else {
                interaction.reply({embeds: [{
                    title: `${string}`,
                    description: `${lsit(string)}`,
                    color: help_status,
                    footer: {
                        text: `Посмотрите в список комманд по лучше. А если оно там есть, но выдало это сообщение - обратитесь к ${emilia.members?.cache?.get(`211144644891901952`)?.user?.tag || interaction.guild.members?.cache?.get(`211144644891901952`)?.user?.tag || `создателю бота`} и сделайте скрин моего ответа.`,
                    }
                }], 
                    ephemeral: true
                });
            }
        }
    }); // БД настройки сервера
    }
}