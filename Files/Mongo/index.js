module.exports = (message, command, client) => {
    require(`./fetchBalance.js`)(client);
    require(`./getBalance.js`)(client);
    require(`./toFixedNumber.js`)(client);
    require(`./randomBalance.js`)(message, client);
}