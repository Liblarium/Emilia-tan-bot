const Balance = require("../../Database/Mongoose/balance");

module.exports = async (message, client) => {

    if (message.author.bot || message.channel.id != `829421957891489825`) return;
    if (message.author.id == `211144644891901952` ||  `357203448640307201` == message.author.id) {
    const randomAmount = Math.random() * (0.7 - 0.3) + 0.3;
    const storedBalance = await client.fetchBalance(message.author.id, message.guild.id);

    await Balance.findOneAndUpdate({ _id: storedBalance._id }, { balance: await client.toFixedNumber(storedBalance.balance + randomAmount) })
    } else return;
}