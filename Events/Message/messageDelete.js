const { conErr } = require(`${process.cwd()}/config.js`);
const { guildId } = require(`${process.cwd()}/config.js`).config_client;
const { modFilt } = require(`${process.cwd()}/Files/log_filter.js`);
const { ChannelType } = require(`discord.js`);
module.exports = {
  name: `messageDelete`,
  async execute (message, emilia) {
    const { database } = require(`${process.cwd()}/Database/database.js`);
    if (message.channel.type === ChannelType.DM || message.channel.id == `1063469185038037102`) return;
    if (message.channel.id === `941072543111069738`) {
      return message.guild.members.cache.get(`211144644891901952`).send({embeds: [{
      author: {
        name: `${message.member.user.tag}`, 
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      },
      color: parseInt(`ff0000`, 16),
      footer: {
        text: `ID пользователя: ${message.author.id}`
      },
      timestamp: new Date(),
      description: `**Удалённое сообщение**:\n${message.content}`,
      fields: [
        {
          name: `Канал`, 
          value: `${message.channel} (${message.channel.name})`, 
          inline: true
        }, {
          name: `Автор`, 
          value: `${message.author} (${message.author.tag})`, 
          inline: true
        },
      ],
    }],
  });
}
    if (message.channel.type != ChannelType.DM && message.member?.user?.bot) return;
    database.fetchData(`guildID`, `${message.guild.id}`, `guild_log`, rows => {
      if (rows === undefined) return conErr(`DeleteMessage`, `Краш логи удаление сообщений (${message.guild?.name}). (0)[0]`);
      if (rows === null) return conErr(`DeleteMessage`, `${message.guild.name} нет в БД! (1)[0]`);
      if (rows.statusDelMsg === false) return;
      if (!message.guild.channels.cache.find(c => c.id === rows.logDelMsg)) return conErr(`DeleteMessage`, `Я не могу найти канал ${rows.logDelMsg} на сервере ${message.guild.name}. (0)[1]`);
      if (!message.guild.members.me.permissionsIn(rows.logDelMsg).has(emilia.perms[28])) return conErr(`DeleteMessage`, `Я не могу написать в канал ${rows.logDelMsg} на сервере ${message.guild.name} (1)[1]`);
      if (message.guild.id == guildId) {
      if (modFilt.includes(message.channel.id)) {
        let delsEmbed = {
        author: {
          name: `${message.member?.user.tag}`, 
          iconURL: message.member?.displayAvatarURL({ dynamic: true })
        },
        color: parseInt(`ff0000`, 16),
        footer: {
          text: `ID пользователя: ${message.author?.id}`
        },
        timestamp: new Date(),
      };
        if (message.content.length <= 1023) {
          delsEmbed.description = `**Удалённое сообщение**`;
          delsEmbed.fields = [
          { 
            name: `Содержание:`, 
            value: `${message.content  || `-__Отсутствует__-`}`
          }, { 
            name: `Канал`, 
            value: `${message.channel} (${message.channel.name})`, 
            inline: true
          }, { 
            name: `Автор`, 
            value: `${message.author} (${message.author?.tag})`, 
            inline: true
          }
        ];
        message.guild.channels.cache.get(`974291942991093801`).send({embeds: [delsEmbed]});
        } else if (message.content.length >= 1024) {
          delsEmbed.description = `**Удалённое сообщение**:\n${message.content}`;
          delsEmbed.fields = [
            {
              name: `Канал`, 
              value: `${message.channel} (${message.channel.name})`, 
              inline: true
            }, {
              name: `Автор`, 
              value: `${message.author} (${message.author?.tag})`, 
              inline: true
            },
          ];
        message.guild.channels.cache.get(`974291942991093801`).send({embeds: [delsEmbed]});
      }
      }
    }
      let delEmbed = {
        author: {
          name: `${message.member?.user.tag}`, 
          iconURL: message.member?.displayAvatarURL({ dynamic: true })
        },
        color: parseInt(`ff0000`, 16),
        footer: {
          text: `ID пользователя: ${message.author?.id}`
        },
        timestamp: new Date(),
      }; 
      if (message.content.length <= 1023) {
        const { author, color, footer, timestamp } = delEmbed;
         delEmbed = {
          author: author,
          color: color,
          footer: footer,
          timestamp: timestamp,
          description: `**Удалённое сообщение**`,
          fields: [
        {
          name: `Содержание:`, 
          value: `${message.content  || `-__Отсутствует__-`}`
        }, {
          name: `Канал`, 
          value: `${message.channel} (${message.channel.name})`, 
          inline: true
        }, {
          name: `Автор`, 
          value: `${message.author} (${message.author?.tag})`, 
          inline: true
        },
        ],
      };
      message.guild.channels.cache.get(rows.logDelMsg).send({embeds: [delEmbed]});
      } else if (message.content.length >= 1024) {
        const { author, color, footer, timestamp } = delEmbed;
        delEmbed = {
          author: author,
          color: color,
          footer: footer,
          timestamp: timestamp,
          description: `**Удалённое сообщение**:\n${message.content}`,
          fields: [
            {
              name: `Канал`, 
              value: `${message.channel} (${message.channel.name})`, 
              inline: true
            }, {
              name: `Автор`, 
              value: `${message.author} (${message.author?.tag})`, 
              inline: true
            },
          ]
        };
      message.guild.channels.cache.get(rows.logDelMsg).send({embeds: [delEmbed]});
    }
  });
}
}
