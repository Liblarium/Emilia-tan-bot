const { conErr } = require(`../../config.js`);
module.exports = {
  name: `channelDelete`,
  async execute (channel, emilia) {
    const { database } = require(`../../Database/database.js`);
    database.fetchData(`guildID`, `${channel.guild.id}`, `guild_log`, rows => {
      if (rows === undefined) return conErr(`ChannelDelete`, `Краш удаление канала. (0)[0]`);
      if (rows === null) return conErr(`ChannelDelete`, `${channel.guild.name} нет в БД! (удаление канала) (1)[0]`);
      if (rows.statusRemChannel === false) return;
      if (!channel.guild.channels.cache.find(c => c.id === rows.logRemChannel)) return conErr(`ChannelDelete`, `Я не могу найти канал ${rows.logRemChannel} на сервере ${channel.guild.name} (удаление канала)(0)[1]`);
      if (!channel.guild.members.me.permissionsIn(rows.logRemChannel).has(emilia.perms[28])) return conErr(`ChannelDelete`, `Я не могу написать в канал ${rows.logRemChannel} на сервере ${channel.guild.name} (удаление канала)(1)[1]`);
      channel.guild.channels.cache.get(rows.logRemChannel).send({ embeds: [{
        author: {
          name: `${channel.guild.name}`, 
          iconURL: channel.guild.iconURL({ dynamic: true })
        },
        title: `Удаление канала.`,
        fields: [
          {
          name: `Имя канала:`, value: `${channel.name}`,
          },
        ],
        footer: {
          text: `Имя канала: ${channel.name}`
        },
        color: parseInt(`ff0000`, 16),
        timestamp: new Date()
      }],
    });
    });//БД логи
  },
};
