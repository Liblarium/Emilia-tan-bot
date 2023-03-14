const { conLog, conErr } = require("../../config");
const Balance = require(`../../Database/Mongoose/balance.js`);
const { ObjectId } = require(`mongoose`).Types;

module.exports = (client) => {
    client.fetchBalance = async (userId, guildId) => {
        let storeBalance = await Balance.findOne({ userid: userId, guildId: guildId })

        if (!storeBalance) {
            storeBalance = await new Balance({
                _id: ObjectId(),
                userid: userId,
                guildid: guildId,
            });

            await storeBalance.save().then(async (bal) => {
                conLog(`fetchBalance`, `Был вписан новый юзер: UserId: ${bal.userId}, GuildId: ${bal.guildId}`);
            }).catch( err => {
                conErr(`fetchBalance`, err);
            });
            return storeBalance;
        } else return storeBalance;
    }
}