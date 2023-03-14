const { conErr } = require(`../../config.js`);
const { ChannelType } = require(`discord.js`);
module.exports = {
  name: `channelUpdate`,
  async execute (oldChannel, newChannel, emilia) {
    const { database } = require(`../../Database/database.js`);
    if (newChannel.name == oldChannel.name || newChannel.type === ChannelType.DM || oldChannel.type === ChannelType.DM) return;
    if (newChannel.name) {
      database.fetchData(`guildID`, `${oldChannel.guild.id}`, `guild_log`, rows => {
        if (rows === undefined) return conErr(`ChannelUpdate`, `Краш изменение канала имя (изменение канала). (0)[0]`);
        if (rows === null) return conErr(`ChannelUpdate`, `${oldChannel.guild.name} нет в БД! (изменеия канала). (1)[0]`);
        if (rows.statusUpdChannel === false) return;
        if (!newChannel.guild.channels.cache.find(c => c.id === rows.logUpdChannel)) return conErr(`ChannelUpdate`, `Я не могу найти канал ${rows.logUpdChannel} на сервере ${oldChannel.guild.name} (изменение канала). (0)[1]`);
        if (!newChannel.guild.members.me.permissionsIn(rows.logUpdChannel).has(emilia.perms[28])) return conErr(`ChannelUpdate`, `Я не могу написать в канал ${rows.logUpdChannel} на сервере ${oldChannel.guild.name} (изменение канала). (1)[1]`);
        newChannel.guild.channels.cache.get(rows.logUpdChannel).send({embeds: [{
          author: {
            name: oldChannel.guild.name, 
            iconURL: oldChannel.guild.iconURL({ dynamic: true })
          },
          title: `Изменение канала.`,
          fields: [
            { 
              name: `Старое имя канала:`, 
              value: `${oldChannel.name}`, 
              inline: true 
            }, { 
              name: `Новое имя канала:`, 
              value: `${newChannel.name} (${newChannel})` 
            },
          ],
          footer: {
            text: `ID канала: ${oldChannel.id}`,
          },
          color: parseInt(`ff6100`, 16),
          timestamp: new Date()
        }],
      });
      });//БД логи
    };
  },
};
