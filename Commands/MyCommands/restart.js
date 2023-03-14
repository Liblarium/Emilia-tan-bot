const { time } = require(`${process.cwd()}/config.js`);
module.exports = {
    name: `restart`,
    aliases: [`rt`],
    option: {
        type: `command`,
        delete: true,
        owner: true,
    },
    description: `Перезапуск бота. Пока не работает так, Как мне нужно`,
    async execute (message, args, commandName, emilia) {
        emilia.destroy();
        emilia.login(process.env.TOKEN);
        console.log(`[${time()}][Система | Рестарт]: ${emilia?.user?.username} была перезапущена`);
    }
}