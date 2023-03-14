const { conErr, conLog, config_client } = require(`../../config.js`);
const { guildId } = config_client;
module.exports = {
  name: `guildMemberRemove`,
  async execute (member, emilia) {
    const { database } = require(`../../Database/database.js`);
    if (member.guild.id == guildId) {
      if (member.bot == true) {
        conLog(`LeaveMember`, `${member.user.tag} был(а) кикнут(а) с бункера`);
      } else {
        conLog(`LeaveMember`, `${member.user.tag} покинул(а) бункер`);
      }
    }
    database.fetchData(`guildID`, `${member.guild.id}`, `guild_log`, rows => {
      if (rows === undefined) return conErr(`LeaveMember`, `Краш при выходе ${member.user.tag}. (0)[0]`);
      if (rows === null) return conErr(`LeaveMember`, `${member.guild.name} нет в БД! (1)[0]`);
      if (rows.statusRemMembr === false) return;
      if (!member.guild.channels.cache.find(c => c.id === rows.logRemMembr)) return conErr(`LeaveMember`, `Я не могу найти канал ${rows.logRemMembr} на сервере ${member.guild.name}. (0)[1]`);
      if (!member.guild.members.me.permissionsIn(rows.logRemMembr).has(emilia.perms[28])) return conErr(`LeaveMember`, `Я не могу написать в канал ${rows.logRemMembr} на сервере ${member.guild.name}. (1)[1]`);
      if (member.bot) {
        member.guild.channels.cache.get(rows.logRemMembr).send({embeds: [{
          author: {
            name: `${member.user.tag}`, 
            iconURL: member.displayAvatarURL({ dynamic: true })
          },
          description: `${member.user.tag} был(а) кикнут(а) с сервера.`,
          color: parseInt(`ff0000`, 16),
          timestamp: new Date(),
          footer: {
            text: `ID бота: ${member.user.id}`}
          }],
        });
      } else { 
        member.guild.channels.cache.get(rows.logRemMembr).send({embeds: [{
          author: {
            name: `${member.user.tag}`, 
            iconURL: member.displayAvatarURL({ dynamic: true })
          },
          description: `${member.user.tag} покинул(а) нас.`,
          color: parseInt(`ff0000`, 16),
          timestamp: new Date(),
          footer: {
            text: `ID пользователя: ${member.user.id}`}
          }],
        });
      }
      
    });//БД логи
  }
}
