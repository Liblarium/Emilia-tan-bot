const { conErr } = require(`../../config.js`);
module.exports = {
  name: `channelCreate`,
  async execute (channel, emilia) {
    const { database } = require(`../../Database/database.js`);
    database.fetchData(`guildID`, `${channel.guild.id}`, `guild_log`, rows => {
      if (rows === undefined) return conErr(`ChannelCreate`, `Краш логи создание канала`);
      if (rows === null) return conErr(`ChannelCreate`,`${channel.guild.name} нет в БД! (Создание канал)`);
      if (rows.statusCreChannel === false) return;
      if (!channel.guild.channels.cache.find(c => c.id === rows.logCreChannel)) return conErr(`ChannelCreate`, `Я не могу найти канал ${rows.logCreChannel} на сервере ${channel.guild.name}. (0)[0]`);
      if (!channel.guild.members.me.permissionsIn(rows.logCreChannel).has(emilia.perms[28])) return conErr(`ChannelCreate`, `Я не могу написать в канал ${rows.logCreChannel} на сервере ${channel.guild.name}(1)[0]`);
      channel.guild.channels.cache.get(rows.logCreChannel).send({embeds: [{
        author: { 
          name: `${channel.guild.name}`, 
          iconURL: channel.guild.iconURL({ dynamic: true })
        },
        title: `Создание канала.`,
        fields: [
          { 
          name: `Имя канала:`, 
          value: `${channel.name} (${channel})`
          },
        ],
        color: parseInt(`25ff00`, 16),
        footer: {text: `ID канала: ${channel.id}`},
        timestamp: new Date(),
      }],
    });
    });//БД логи
  },
};
