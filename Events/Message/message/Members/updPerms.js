const { conErr, conLog } = require("../../../../config.js");
const { database } = require("../../../../Database/database.js");

exports.updPerms = (type) => {
    if (type.channel.id == `748647974027919511` || type.guild.id != `451103537527783455`) return;
    let perms;
    const dostup = type?.member?.user?.id || type?.author?.id;
    const memers = type?.member?.user?.displayName || type?.author?.username;
    const guest = [`809884813938262067`];
    const user = [`815559081686859796`];
    const reader = [`748102803741736960`];
    const readerA = [reader[0], `775435163210350602`];
    const readerB = [reader[0], `781582704617455646`];
    const readerC = [reader[0], `821524602479706112`];
    const readerD = [reader[0], `835251169797603359`];
    const readerE = [reader[0], `835251249711415376`];
    const author = [`802974567756201994`];
    const gunsmith = [`724608047862775828`, `826050594842083359`];
    const all = [guest[0], user[0], reader[0], readerA[1], readerB[1], readerC[1], readerD[1], readerE[1], gunsmith[0], gunsmith[1], author[0]];
    const rol = (rls) => {
        if (author?.every(r => rls?.has(r))) {
            perms = `Автор`;
        } else if (readerE?.every(r => rls?.has(r))) {
            perms = `D5`;
        } else if (readerD?.every(r => rls?.has(r))) {
            perms = `D4`;
        } else if (readerC?.every(r => rls?.has(r))) {
            perms = `D3`;
        } else if (readerB.every(r => rls?.has(r))) {
            perms = `D2`;
        } else if (readerA?.every(r => rls?.has(r))) {
            perms = `D1`;
        } else if (rls?.has(reader[0])) {
            perms = `Чтец`;
        } else if (rls?.has(user[0])) {
            perms = `Пользователь`;
        } else if (rls?.has(guest[0])) {
            perms = `Гость`;
        } else if (type.author.discriminator == `0000`) {
            perms = `Вебхук`;
        } else if ([`813146116676648971`, `790632585301983232`].includes(dostup)) {
            perms = `${type.author.username}`;
        } else if (type.author.bot && type.author.discriminator != `0000` && !rls.some(r => all.includes(r.id))) {
            perms = `Бот`;
        } else {
            perms = `Ашибка`;
        }
    }
    rol(type?.member?.roles?.cache);
    if (type?.member?.roles?.cache.some(r => gunsmith.includes(r.id)) && type?.member?.roles?.cache?.has(reader[0])) perms = `${perms}, Оружейник`;
    database.fetchData(`id`, `${dostup}`, `users`, usr => {
        if (usr === undefined) return conErr(`Message/message/Members/updPemrs.js`, `Призошла ошибка при проверке юзера в БД`);
        if (usr === null) return; //Не вижу смысла выводить информацию об этом
            if (usr?.dostup != perms) {
    database.updatePartialData(dostup, { dostup: `${perms}` }, `users`, upUsr => {
        if (upUsr === undefined) return conErr(`Message/Message/Members/updPemrs.js`, `Произошла ошибка при изменении прав`);
        if (typeof upUsr != `object`) return conErr(`Message/Message/Members/updPemrs`, `upUsr не оказался object!`);
        conLog(`updPerms`, `Права ${memers} были изменены на ${perms}`);
    });//Изменение прав
        } else return;
    });//Проверка наличия в БД
}