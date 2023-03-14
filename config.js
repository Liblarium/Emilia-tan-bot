exports.config_client = {
    prefix: `++`,
    clientId: `813146116676648971`,
    guildId: `451103537527783455`,
    ownerId: `211144644891901952`,
    reportId: `931608832575172719`,
    newMemberRole: `809884813938262067`,
}
exports.config_private_voiсe = {
    channel_id: `829404416720896070`,
    category_id: `829467823625470003`,
    guild_id: `451103537527783455`
}
exports.time = () => {
    const t = {
    hour: new Date().getHours().toString().padStart(2, `0`), 
    minute: new Date().getMinutes().toString().padStart(2, `0`),
    second: new Date().getSeconds().toString().padStart(2, `0`),
    }
    return `${t.hour}:${t.minute}:${t.second}`;
};
/**
 * @description Мини-функция для вывода сообщения о ошибке
 * @param {any} name Краткое название
 * @param {any} err Сама ошибка
 */
exports.conErr = (name, err) => {
    const { time } = require(`./config.js`);
    return console.error(`[${time()}][ERR | ${name}]: `, err);
}
/**
 * 
 * @param option named, client 
 * @param log log
 */
exports.conLog = (option, log) => {
    const { time } = require(`./config.js`);
    if (typeof log == `string`){
        return console.log(`[${ time() }][Эмилия-Тан | ${ option }]: ${log}`);
    } else {
        return console.log(`[${ time() }] Эмилия-Тан | ${ option }]:`, log);
    }
}