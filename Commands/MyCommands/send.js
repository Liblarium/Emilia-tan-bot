module.exports = {
    name: `скажи`,
    aliases: [],
    option: {
        type: `command`,
        delete: true,
        owner: true,
    },
   description: `Сказать от имени бота`,
   async execute (message, args, commandName, emilia) {
    let msg;
    let channel = message.mentions.channels.first()
   	console.log(`[${emilia.times()}][${emilia.user.username}]: ${message.author.tag} использовала Скажи.`)
   	if(!args[0]) return message.channel.send(`А где текст?`);

   	if(channel) {

      msg = args.slice(1).join(` `);
      channel.send(msg)

      //embeds: [{ 
        //description: `${message.content.substring(prefix.length).split(` `).slice(1).join(` `)}`,
        //color: parseInt(`00CED1`, 16) 
      //}]
   } else {
   	msg = args.join(` `);
   	message.channel.send(msg)
  	}
   } 
}