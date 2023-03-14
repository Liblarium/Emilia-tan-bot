module.exports = (type, client) => {
    const { Members } = require("./members.js")
    const { Command } = require("./command.js");
    Members.on(type, client);
    Command.on(type, client);
}