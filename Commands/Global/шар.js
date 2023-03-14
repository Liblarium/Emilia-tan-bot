const { sharAll, sharGlobal } = require(`${process.cwd()}/Files/index.js`).shar;
module.exports = {
    name: `шар`,
    aliases: [],
    option: {
        type: `command`,
        delete: false,
        perms: 0,
    },
    description: `Вопросы боту, на которые он ответит рандомным ответом`,
    async execute (message, args, commandName, emilia) {
        if (!args[0]) return message.channel.send(`А где вопрос?`);
        if (args.join(` `)) {
            if (message.guild.id === /*`451103537527783455`*/ `334418584774246401`) {
               await message.reply(`\u000A${sharAll[Math.floor(Math.random() * sharAll.length)]}`);
            } else {
               await message.channel.send(sharGlobal[Math.floor(Math.random() * sharGlobal.length)]);
            }
        }
    }
}