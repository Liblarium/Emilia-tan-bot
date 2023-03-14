const { conLog, conErr } = require("../../../config");

module.exports = (oldVoice) => {
        const { database } = require("../../../Database/database");
    database.fetchData(`id`, `${oldVoice.channel?.id}`, `private_voice`, pr => {
        if (pr === undefined) return conErr(`Private Channel`, `Ошибка при проверке наличия канала в БД!`);
        if (pr !== null) {
            const members = [];
            const member = oldVoice.channel?.members;
            members.push(member.filter(f => f.user.bot == false).map(i => i.id));
            if (members[0].length < 1) members.length = 0;
        if (oldVoice.member.user.id == pr?.owner) {
            if (members.length < 1) return database.deleteByIds(oldVoice.channel.id, `private_voice`, g => {
                if (g === undefined) return conErr(`Private Channel`, `Произошла ошибка при удалении канала с БД!`);
                conLog(`Private Channel`, `Был удалён канал ${oldVoice.channel.name} с сервера ${oldVoice.guild.name}`);
                oldVoice.channel.delete().catch(err => conErr(`Private Channel`, err));
            });
            if (members.length > 0) {
                let owner = 0;
                if (members.length == 1) owner = members[0];
                let random = Math.round(Math.random() * members.length);
                if (random >= members.length) random -= 1;
                if (members.length >= 2) owner = members[random];
            database.updatePartialData(oldVoice.channel.id, { owner: `${owner}` }, `private_voice`, g => {
                if (g === undefined) return conErr(`Private Voice`, `Произошла ошибка при выборе нового овнера при выходе прошлого`);
                if (typeof g != `object`) return conErr(`Private Voice`, `this g is not a object`);
                conLog(`Private Voice`, `Был выбран новый овнер (при выхоже прошлого) в канале ${oldVoice.channel.name} на сервере ${oldVoice.guild.name}`);
            });
            }
        } 
        }
    });
}
