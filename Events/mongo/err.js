const { time } = require("../../config")

module.exports = {
    name: `err`,
    async execute (err) {
        console.log(`[${time()}][Mongo | Err]:`, err);
    }
}