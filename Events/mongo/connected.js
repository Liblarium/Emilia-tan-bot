const { time } = require("../../config")

module.exports = {
    name: `connected`,
    async execute () {
        console.log(`[${time()}][Система | mongo]: База данных подключена.`);
    }
};