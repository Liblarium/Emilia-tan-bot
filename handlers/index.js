module.exports = (client) => {
    require(`./CommandHandler.js`)(client);
    require(`./EventHandler.js`)(client);
}