const Balance = require(`../../Database/Mongoose/balance.js`);

module.exports = (client) => {
    client.getBalance = async (user, guild) => {
        const storeBalance = await Balance.findOne({ userId: user, guildId: guild })

        if (!storeBalance) return false;
        else return storeBalance;
    }
}