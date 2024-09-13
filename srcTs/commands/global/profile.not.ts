// const { conErr } = require(`${process.cwd()}/config.js`);
// const { guildId } = require(`${process.cwd()}/config.js`).config_client;
// module.exports = {
//     name: `profile`,
//     aliases: [`pr`],
//     option: {
//       type: `command`,
//       delete: true,
//       perms: 0
//     },
//     description: `Просмотр профиля (своего/чужого)`,
//     async execute (message, args, commandName, emilia) {
//     const { database } = require(`${process.cwd()}/Database/database.js`);
//     let Usr = {};
//     const usrMention = message.mentions.members.first();
//     const usrIds = message.guild.members.cache.get(args[0]);
//     if (usrMention) Usr.user = usrMention;
//     if (usrIds) Usr.user = usrIds;
//     if (!usrMention && !usrIds) Usr.user = message.member;
//     Usr = {
//         user: Usr.user,
//         color: Usr.user.displayColor,
//         id: Usr.user.user.id,
//         name: Usr.user.user.displayName || Usr.user.user.username,
//         dostup: `Ваш уровень доступа:`,
//         pol: `Ваш пол:`,
//         avatar: Usr.user.user.displayAvatarURL({dynamic: true}),
//         create: parseInt(Usr.user.user.createdTimestamp / 1000),
//         join: parseInt(Usr.user.joinedTimestamp / 1000),
//         date: new Date(),
//         tag: Usr.user.user.tag,
//     }
//     let colors;
//     database.fetchData(`id`, `${Usr.id}`, `users`, usr => {
//         if (usr === undefined) return conErr(`${commandName}`, `Краш проверки наличия пользователя в БД (0)[0]`);
//         let per = {};
//         if (usr === null) {
//             per = {
//                 dostup: `Вне Базы Данных`,
//                 pol: `Вне Базы Данных`,
//                 info: `Этот пользователь находится вне Базы данных`,
//                 tityl: `Вне Базы Данных`,
//                 dn: `Вне Базы Данных`,
//                 pechenie: `-0` }
//         } else {
//             per = {
//                 dostup: usr.dostup,
//                 pol: usr.pol,
//                 info: usr.info,
//                 dn: usr.dn,
//                 tityl: usr.tityl,
//                 pechenie: usr.pechenie,
//             }
//         }
//         if (usrMention && usrMention.user.id != message.member.user.id || usrIds && usrIds.user.id != message.member.user.id ) Usr.dostup = `Уровень доступа этого пользователя:`, Usr.pol = `Пол этого пользователя:`;
//         if (!usrMention && !usrIds || usrMention?.user?.id == message.member.user.id || usrIds && usrIds.user.id == message.member.user.id) Usr.dostup = Usr.dostup, Usr.pol = Usr.pol;
//         if (new Number(Usr.color) == 0) { colors = parseInt(`48dfbf`, 16) } else if (new Number(Usr.color) != 0) { colors = Usr.color; }
//         if ([guildId].includes(message.guild.id)) {
//         message.channel.send({embeds: [{
//             title: `Профиль ${Usr.name}`,
//             author: {
//                 name: `${Usr.tag}`,
//                 iconURL: `${Usr.avatar}`,
//             },
//             thumbnail: {
//                 url: `${Usr.avatar}`,
//             },
//             fields: [
//                 { name: `Зашёл(а) на сервер:`, value: `<t:${Usr.join }> (<t:${Usr.join}:R>)` },
//                 { name: `${Usr.dostup}`, value: `${per.dostup}\u200b`, },
//                 { name: `${Usr.pol}`, value: `${per.pol}`, },
//                 { name: `Титулы:`, value: `${per.tityl}` },
//                 //{name: `Печенье`, value: `${per.pechenie`} 🍪` },
//                 { name: `Попадений в ЧС Liblarium Bunker:`, value: `${per.dn}` },
//                 { name: `Информация о пользователе:`, value: `${per.info}` },
//             ],
//             color: colors,
//             timestamp: Usr.date,
//             footer: {
//                 text: `Уровень доступа: ${per.dostup}`,
//                 iconURL: Usr.avatar,
//             }
//         }]})
//     } else {
//         message.channel.send({embeds: [{
//             title: `Профиль ${Usr.name}`,
//             author: {
//                 name: `${Usr.tag}`,
//                 iconURL: Usr.avatar,
//             },
//             thumbnail: {
//                 url: Usr.avatar,
//             },
//             fields: [
//                 { name: `Зашёл(а) на сервер:`, value: `<t:${Usr.join}> (<t:${Usr.join}:R>)` },
//                 { name: `Регистрация в Дискорде:`, value: `<t:${Usr.create}> (<t:${Usr.create}:R>)`}
//             ],
//             color: colors,
//             timestamp: Usr.date,
//             footer: {
//                 text: `Команда будет обновлена... возможно`,
//                 iconURL: Usr.avatar,
//             },
//         }]})
//     }
//     }); //БД профиля
//     }
// }