const { conErr, conLog } = require("../../../../config.js");
const { database } = require("../../../../Database/database.js");

exports.updUsrname = async (type) => {
        if (type.guild.id != `451103537527783455`) return;
    if (type?.author?.discriminator == `0000`) {
    const us = await database.fetchDataAsync(`id`, `${type.author.id}`, `users`);
        if (us === undefined) return conErr(`Message/message/updUsrname.js`, `Проблемы с проверкой вебхуков в БД`);
        if (us === null) return conErr(`Message/message/updUsrname.js`, `Вебхук не попал в БД.`);
        if (us.usrname != type.author.username) {
    const usUpd = await database.updatePartialData(type.author.id, { usrname: `${type.author.username}`}, `users`);
        if (usUpd === undefined) return conErr(`Message/message/updUsrname.js`, `Проблемы с обновлением ника вебхука`);
        if (typeof usUpd != `object`) return conErr(`Message/message/updUsrname.js`, `usUpd не оказался object`);
        }
    } else {
    database.fetchData(`id`, `${type?.member?.user?.id}`, `users`, usr => {
        if (usr === undefined) return conErr(`Message/message/updUsrname.js`, `При проверке на наличие пользователя - произошла ошибка. (0)[0]`);
        if (usr === null) return conErr(`Message/message/updUsrname.js`, `Пользователя не оказалось в БД! (1)[0]`);
        if (usr?.usrname != type?.member?.displayName) { //Если имя у человека не равно имени в БД
    database.updatePartialData(type.member.user.id, { usrname: `${type?.member?.displayName}` }, `users`, upUsr => {
        if (upUsr === undefined) return conErr(`Message/message/updUsrname.js`, `При изменении имени пользователя в БД произошла ошибка. (0)[1]`);
        if (typeof upUsr != `object`) return conErr(`Message/message/updUsrname.js`, `upUsr не оказался object! (1)[1]`);
        return conLog(`updUsrname`, `Имя ${type?.member?.displayName} было обновлено в БД!`);
    }); //обновление имени юзера в БД
        } else { //Если имя равно тому, что в БД
            return;
        }
    }); //проверка на наличие человека в БД
    }
}