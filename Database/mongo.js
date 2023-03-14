const { set, connect } = require(`mongoose`);
const { conErr } = require("../config");
module.exports = async () => {
    set(`strictQuery`, true);
    await connect(`mongodb://127.0.0.1:27017/yumebd`, { useNewUrlParser: true }).catch( err => conErr(`mongo`, err));
};