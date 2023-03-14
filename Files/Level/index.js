const { ChannelType } = require(`discord.js`);
const { conLog, conErr } = require(`../../config.js`);
const { database } = require(`../../Database/database.js`);

module.exports = (type) => {
    const day_limit = 75;
    if (type.channel.type === ChannelType.DM || type.guild.id != `451103537527783455` || type?.author?.bot == true) return;
    database.fetchData(`id`, `${type?.author?.id}`, `users`, usr => {
        if (usr === undefined) return conErr(`Level`, `Произошла ошибка при проверке пользователя в базе данных!`);
        if (usr !== null) {
            const mesCount = parseInt(usr.mes_size) + 1;
            const nextLvL = parseInt(usr.max_xp) * 10;
            let addExp = Math.floor(Math.random() * 5);
            if (addExp < 2) addExp = 2;
            if (addExp > 6) addExp = 5;
            const date = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`;
        if (usr.day != date) {
            database.updatePartialData(type?.author?.id, { day: `${date}`, day_xp: 0, mes_size: mesCount }, `users`, up => {
                if (up === undefined) return conErr(`Level`, `Произошла ошибка при изменении дневного лимита опыта`);
                if (typeof up != `object`) return conErr(`Level`, `up is ${typeof up}, ${typeof up} is not a object!`);
            });
        }
        if (parseInt(usr.day_xp) > day_limit) return; 
        if (date == usr.day && parseInt(usr.day_xp) < day_limit || date != usr.day && parseInt(usr.day_xp) < day_limit || parseInt(usr.day_xp) < day_limit && date != usr.day) {
        if (mesCount % 20 === 0) {
            const newXp = addExp + parseInt(usr.xp);
            if (newXp >= usr.max_xp) {
                database.updatePartialData(type?.author?.id, { xp: `${newXp - parseInt(usr.max_xp)}`, max_xp: `${nextLvL}`, level: parseInt(usr.level) + 1 , mes_size: 0, day_xp: parseInt(usr.day_xp) + addExp, day: `${date}` }, `users`, up => {
                    if (up === undefined) return conErr(`Level`, `Ошибка при изменении уровня юзера`);
                    if (typeof up != `object`) return conErr(`Level`, `up is not object!`);
                    conLog(`Level`, `${type.member.user.tag} получил(а) новый уровень: ${parseInt(usr.level) + 1}`);
                    type.guild.channels.cache.get(`814130962728222750`).send({content: `${type.member.user.tag} ваш уровень был повышен до ${parseInt(usr.level) + 1}!`});
                });
            } else {
                database.updatePartialData(type?.author?.id, { xp: `${newXp }`, mes_size: 0, day_xp: parseInt(usr.day_xp) + addExp, day: `${date}` }, `users`, up => {
                    if (up === undefined) return conErr(`Level`, `Ошибка при изменении опыта юзера`);
                    if (typeof up != `object`) return conErr(`Level`, `up not object!`);
                });
            }
        } else {
            database.updatePartialData(type?.author?.id, { mes_size: mesCount, day: `${date}` }, `users`, up => {
                if (up === undefined) return conErr(`Level`, `Ошибка при изменении количества сообщений юзера`);
                if (typeof up != `object`) return conErr(`Level`, `object is not up!`);
            });
        }
        }
        }
    });
}
