const { conErr, conLog } = require("../../../../config.js");
const { database } = require("../../../../Database/database.js");
const { prefixs } = require("../prefixs.js");

exports.addInBD = async (type) => {
    const pref = await prefixs(type);
    const userOrBot = async (u) => {
        if (u.author.discriminator == `0000`) {
            return { a: `Вебхук`, b: `Это вебхук` };
        } else if (u?.member?.bot) {
            return { a: `Бот`, b: `Это бот` };
        } else if (!u?.member?.bot) {
            return { a: `Пользователь`, b: `Вы можете изменить описание о себе с помощью ${pref.prefix}newinfo. Стандартный префикс - ${pref.defPref}. Или /newnifo` }
        } else {
            throw conErr(`Message/message/Members/addInBD.js`, new TypeError(`Введенный пользователь не является ни Ботом, ни Пользователем`));
        }
    }
    const { a, b } = await userOrBot(type);
    let user = type?.member?.user?.id || type?.author?.id;
    let username = type?.member?.displayName || type?.author?.username;
    database.fetchData(`id`, `${user}`, `users`, usr => {
        if (usr === undefined) return conErr(`Message/message/Members/addInBD.js`, `Ошибка при проверке юзера в БД! (0)[0]`);
        if (usr === null) {
            if (type.guild.id === `451103537527783455`) {
                if (type.channel.id === `748647974027919511`) return;
            }
    database.upsertData({id: `${user}`, usrname: `${username}`, dostup: `${a}`, info: `${b}`}, `users`, upUsr => {
        if (upUsr === undefined) conErr(`Message/message/Members/addInBD.js`, `Произошла ошибка при добавлении юзера в БД! (0)[1]`);
        if (typeof upUsr != `object`) conErr(`Message/message/Members/addInBD.js`, `upUsr оказался не object (1)[1]`);
        conLog(`AddInBD`, `${a} ${username} был(а) добавлен(а) в Базу Данных.`);
    });    
        }
    });
}