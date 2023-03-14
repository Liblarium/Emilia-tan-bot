const { time } = require("../../config");

module.exports = {
    name: `disconnected`,
    async execute () {
        console.log(`[${time()}][Mongo | disconnected]: База Данных отключена.`);
    }
}