const { conErr } = require("../../../config");
const { hander } = require("./Commands/handler");
class Commands {
    constructor(type, client) {
        this.type = type;
        this.client = client;
    }
    async on(type, client) {
    const { database } = require(`../../../Database/database.js`);
    database.fetchData(`guID`, `${type?.guild?.id}`, `guild_setting`, gst => {
        if (gst === undefined) return conErr(`Сервера [БД]`, `Краш в command.js при проверке наличия сервера в БД! (0)[0]`);
        if (gst?.guID != type?.guild?.id) { 
            return conErr(`Сервера [БД]`, `Сервера ${type?.guild?.name} нет в БД! (1)[0]`);
        } else {
    database.fetchData(`id`, `${type?.member?.user?.id}`, `users`, async (usr) => {
        if (usr === undefined) return conErr(`Message/message/commands.js`, `Произошла ошибка при проверке на наличие юзера в БД. (0)[1]`);
        if (usr === null) {
            if (gst?.addInBD == true) {
                return conErr(`Message/message/commands.js`, `Пользователь не находится в БД! (1)[1]`);
            } else {
                return;
            }
        }
    const con = usr;
        hander(type, con, client); //обработчик команд
        });//проверка юзеров
    }
    });//Просмотр наличия сервера в БД. Настройки сервера
    }
}

exports.Command = new Commands();