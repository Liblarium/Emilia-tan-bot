const { Schema, model } = require(`mongoose`);
const guildShema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    guildName: String,
    guildIcon: { type: String, required: false },
});

module.exports = new model(`Guilds`, guildShema, `guilds`);