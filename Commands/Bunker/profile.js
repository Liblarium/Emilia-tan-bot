const { SlashCommandBuilder } = require(`discord.js`);
const { conErr } = require(`${process.cwd()}/config.js`);
module.exports = {
    data: new SlashCommandBuilder()
    .setName(`profile`)
    .setDescription(`Посмотреть свой (или чужой) профиль на сервере`)
    .addUserOption(option => option.setName(`профиль`).setDescription(`Выберите того, у кого хотите глянуть профиль`)),
    async execute (interaction, emilia) {
        const { database } = require(`${process.cwd()}/Database/database.js`);
        const users = interaction.options.getUser(`профиль`);
        let profiles;
        if (users) {
            profiles = users.id;
        } else {
            profiles = interaction.member.user.id;
        }
        if (profiles == undefined) return conErr(`${interaction.commandName} (/)`, `profiles пустой`); 
        database.fetchData(`id`, `${profiles}`, `users`, usr => {
            if (usr === null) usr = { dostup: `Вне Базы Данных`, tityl: `Вне Базы Данных`, dn: `Вне Базы Данных`, info: `Этот пользователь не находится в Базе Данных`, pol: `Вне Базы Данных` };
        let colors;
        if (users) {
            users.tag = `${users.username}#${users.discriminator}`;
            users.user = interaction.guild.members.cache.get(users.id);
            if (usr === undefined) return conErr(`${interaction.commandName} (/)`, `Краш при проверке на наличие юзера в БД (0)[0]`);
            if (new Number(users.user.displayColor) == 0) { colors = parseInt(`48dfbf`, 16) } else if (new Number(users.user.displayColor) != 0) { colors = users.user.displayColor; }
            interaction.reply({embeds: [{
                author: { 
                    name: `${users.tag}`, 
                    iconURL: users.displayAvatarURL({ dynamic: true }) 
                },  
                title: `Профиль: ${users.username}`,
                color: `${colors}`,
                fields: [{
                    name: `Зашёл(а) на сервер:`,
                    value: `<t:${parseInt(users.user.joinedTimestamp / 1000)}> (<t:${parseInt(users.user.joinedTimestamp / 1000)}:R>)`
                }, {
                    name: `Уровень доступа этого пользователя:`,
                    value: `${usr.dostup}`,
                }, {
                    name: `Пол этого пользователя:`,
                    value: `${usr.pol}`,
                }, {
                    name: `Титулы:`,
                    value: `${usr.tityl}`,
                }, {
                    name: `Попадений в ЧС Liblarium Bunker:`,
                    value: `${usr.dn}`,
                }, {
                    name: `Информация о пользователе:`,
                    value: `${usr.info}`,
                }],
                footer: {
                    text: `Уровень доступа: ${usr.dostup}`,
                    iconURL: interaction.guild.iconURL({dynamic: true}),
                } 
                }],
            });
        } else {
            if (new Number(interaction.member.displayColor) == 0) { colors = parseInt(`48dfbf`, 16) } else if (new Number(interaction.member.displayColor) != 0) { colors = interaction.member.displayColor; }
            interaction.reply({embeds: [{
                title: `Профль: ${interaction.user.username}`,
                author: {
                    name: `${interaction.user.username}`,
                    iconURL: interaction.member.displayAvatarURL({dynamic: true}),
                },
                color: colors,
                fields: [{
                    name: `Зашёл(а) на сервер:`,
                    value: `<t:${parseInt(interaction.member.joinedTimestamp / 1000)}> (<t:${parseInt(interaction.member.joinedTimestamp / 1000)}:R>)`
                }, {
                    name: `Ваш уровень доступа:`,
                    value: `${usr.dostup}`,
                }, {
                    name: `Ваш пол:`,
                    value: `${usr.pol}`,
                }, {
                    name: `Титулы:`,
                    value: `${usr.tityl}`,
                }, {
                    name: `Попадений в ЧС Liblarium Bunker:`,
                    value: `${usr.dn}`,
                }, {
                    name: `Информация о пользователе:`,
                    value: `${usr.info}`,
                }],
                footer: {
                    text: `Уровень доступа: ${usr.dostup}`,
                    iconURL: interaction.guild.iconURL({dynamic: true}),
                }
            }],
            });
        }
    }); //БД профиля
    }
}