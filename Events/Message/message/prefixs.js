const { conErr, config_client } = require("../../../config.js");
const { database } = require("../../../Database/database.js");

exports.prefixs = async (type) => {
    const pref = { prefix: config_client.prefix, defPref: config_client.prefix };
    const pr = await database.fetchDataAsync(`guID`, `${type?.guild?.id}`, `guild_setting`);
        if (pr === undefined) return conErr(`Message/message/prefixs.js`, `Ошибка при проверке id сервера`);
        if (pr === null) return pref;
        if (pr != null) pref.prefix = pr?.pref, pref.defPref = pr?.defPref;
        return pref;
}