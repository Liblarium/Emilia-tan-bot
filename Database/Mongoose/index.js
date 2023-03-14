const { conLog, conErr } = require("../../config.js");
const Balance = require(`./balance.js`);
const { ObjectId } = require(`mongoose`).Types;
const toFixedNumber = (number, places = 2) => {
    const offset = Number(`1e${places}`);
    return Math.floor(number * offset) / offset;
}
module.exports = new class Mongo {
    fetchBalance(user, guild, callback) {
        Balance.findOne({ userId: user, guildId: guild }).then(async (req) => {
            if (!req) {
            const balance = new Balance({
                _id: ObjectId(),
                userId: user,
                guildId: guild,
            });
            await balance.save().then(r => {
                conLog(`MongoBD`, `Был вписан новый пользователь в БД: userId: ${r.userId}, guildId: ${r.guildId}`);
            }).catch(e => conErr(`MongoBD`, e));
            return callback(balance);
        } else return callback(req);
        }).catch(e => conErr(`[${time()}][fetchBalance]:`, e));
    }
    getBalance(user, guild, callback) {
        Balance.findOne({userId: user, guildId: guild}).then(req => {
            if (!req) return callback(false);
            else return callback(req);
        }).catch(e => conErr(`[${time}][getBalance]:`, e));
    }
    randomBalance(user, guild, bol) {
        let randomAmount = Math.random() * (0.7 - 0.3) + 0.3;
        if (!bol || bol == false) randomAmount = 0;
        if (randomAmount > 0.001) {
        require(`./`).fetchBalance(user, guild, (req) => {
            Balance.findOneAndUpdate(req._id, { balance: toFixedNumber(req.balance + randomAmount) }, { new: true }).then(g => {
                if (g === undefined) return conErr(`MongoBD`, `Произошла ошибка при измении баланса. [Database/Mongoose/index.js]`), conErr(`MongoBD`, err);
                conLog(`MongoBD`, `Обновлён баланс ${g.userId} и сейчас его размер ${g.balance}`);
            }).catch(e => console.error(`[${time()}][randomBalance]:`, e));
        });
        } else return;
    }
}