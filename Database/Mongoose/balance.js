const { Schema, model } = require(`mongoose`);
const balanceShema = new Schema({
    _id: Schema.Types.ObjectId,
    userId: String,
    guildId: String,
    guildName: String,
    balance: { type: Number, default: 0 },
});

module.exports = new model(`Balance`, balanceShema, `balances`);