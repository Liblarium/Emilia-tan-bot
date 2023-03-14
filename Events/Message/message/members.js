const { conErr } = require("../../../config.js");
const { addInBD } = require("./Members/addInBD.js");
const { updPerms } = require("./Members/updPerms.js");
const { updUsrname } = require("./Members/updUsrname.js");

class DatabaseMembers {
    constructor(type, client) {
        this.type = type;
        this.client = client;
    }
    async on (type, client) {
    const { database } = require("../../../Database/database.js");
    database.fetchData(`guID`, `${type?.guild?.id}`, `guild_setting`, gst => {
        if (gst === undefined) return conErr(`Message/message/members.js`, `Произошла ошибка при проверке guild_setting на наличие данного сервера`);
        if (gst?.guID != type?.guild?.id) {
            return conErr(`Message/message/members.js`, `${type?.guild?.id} не оказалось в БД!`);
        } else {
            if (gst?.addInBD == true) { //добавлять ли людей в БД
                addInBD(type);//Добавление в БД
                updUsrname(type);//Обновление имени в БД
                updPerms(type);//Обновление прав в БД
            } else { //Не добавлять людей в БД
                return;
            }
        }
    }); //Проверка конфигурации в БД
    }
}

exports.Members = new DatabaseMembers();