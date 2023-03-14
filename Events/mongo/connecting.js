const { time } = require("../../config");

module.exports = {
    name: `connecting`,
    async execute () {
        console.log(`[${time()}][Mongo | connecting]: Поключение...`);
    }
}