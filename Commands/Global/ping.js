const { time } = require(`${process.cwd()}/config.js`);
module.exports = {
    name: `ping`,
    aliases: [`пинг`],
    option: {
      type: `command`,
      delete: true,
      perms: 0
    },
    description: `Пинг бота`,
    async execute (message, args, commandName, emilia) {
      console.log(`[${time()}][${emilia.user.username} | Пинг]: ${emilia.ws.ping} ms`);
      message.channel.send({embeds: [{ description:  `Мой пинг: ${emilia.ws.ping} ms.`, color: message.member.displayColor != `0` ? message.member.displayColor : `7180443` }]})  
    }
}