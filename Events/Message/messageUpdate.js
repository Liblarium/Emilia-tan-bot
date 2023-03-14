const { conErr } = require(`${process.cwd()}/config.js`);
const { guildId } = require(`${process.cwd()}/config.js`).config_client;
const { modFilt } = require(`${process.cwd()}/Files/log_filter.js`);
const { ChannelType } = require(`discord.js`);
module.exports = {
  name: `messageUpdate`,
  async execute (oldMessage, newMessage, emilia) {
    const { database } = require(`${process.cwd()}/Database/database.js`);
    if ([oldMessage.channel.type, newMessage.channel.type].includes(ChannelType.DM) || [oldMessage.channel.id, newMessage.channel.id].includes(`1063469185038037102`)) return;
    if (oldMessage.channel.id == `941072543111069738` || newMessage.channel.id == `941072543111069738`) {
      newMessage.guild.members.cache.get(`211144644891901952`).send({embeds: [{
      author: {
        name: `${oldMessage.author?.tag}`, 
        iconURL: oldMessage.author.displayAvatarURL({ dynamic: true })
      },
      color: parseInt(`ff6100`, 16),
      description: `[Сообщение было изменено](${newMessage.url})\n**Старое**:\n${oldMessage.content || `-__Отсутствует__-`}`,
      }],
    })
    newMessage.guild.members.cache.get(`211144644891901952`).send({embeds: [{
      author: {
        name: `${oldMessage.author?.tag}`, 
        iconURL: oldMessage.author.displayAvatarURL({ dynamic: true })
      },
      timestamp: new Date(),
      footer: {
        text: `ID пользователя: ${oldMessage.author.id}`
      },
      description: `**Новое**:\n${newMessage.content || `-__Отсутствует__-`}`,
      color: parseInt(`ff6100`, 16),
      fields: [
        {
          name: `Автор:`, 
          value: `${oldMessage.author}`
        }, {
          name: `Канал:`, 
          value: `${oldMessage.channel}`
        },
      ],
    }],
  });
}
    if ([oldMessage.guild.id, newMessage.guild.id].includes(/*`451103537527783455`*/ guildId)) {
      if (oldMessage.member?.user.bot || newMessage.member?.user.bot || oldMessage.content == newMessage.content) return;
      if (modFilt.includes(oldMessage.channel.id || newMessage.channel.id)) {
        const logsEmbed = {
        author: {
          name: `${oldMessage.author?.tag}`, 
          iconURL: oldMessage.author?.displayAvatarURL({ dynamic: true })
        },
        timestamp: new Date(),
        footer: {
          text: `ID пользователя: ${oldMessage.author?.id}`,
        },
        color: parseInt(`ff6100`, 16),
        };
        if (oldMessage.content.length <= 1023 && newMessage.content.length <= 1023) {
          logsEmbed.description = `[Сообщение было изменено](${newMessage.url})`;
          logsEmbed.fields = [
            {
              name: `Автор:`, 
              value: `${oldMessage.author}`, 
              inline: true
            }, {
              name: `Канал:`, 
              value: `${oldMessage.channel}`, 
              inline: true
            }, {
              name: `Старое:`, 
              value: `${oldMessage.content || `-__Отсутствует__-`}`
            }, {
              name: `Новое:`, 
              value: `${newMessage.content || `-__Отсутствует__-`}`
            },
          ];
          if (newMessage.attachments.size > 0) {
            logsEmbed.fields[{ 
              name: `Файлы:`, 
              value: `${newMessage.attachments.map((a) => a.url)}`
            }]
          }
          if (!newMessage.guild.channels.cache.find(c => c.id === `974291942991093801`)) return console.log(`Nien channel`)
          newMessage.guild.channels.cache.get(`974291942991093801`).send({embeds: [logsEmbed]});
        } else if (oldMessage.content.length >= 1024 || newMessage.content.length >= 1024) {
          logsEmbed.description = `[Сообщение было изменено](${newMessage.url})\n**Старое**:\n${oldMessage.content || `-__Отсутствует__-`}`;
          newMessage.guild.channels.cache.get(`974291942991093801`).send({embeds: [logsEmbed, {
          description: `**Новое**:\n${newMessage.content|| `-__Отсутствует__-`}`,
          color: parseInt(`ff6100`, 16),
          fields: [
            {
              name: `Автор:`, 
              value: `${oldMessage.author}`
            }, {
              name: `Канал:`, 
              value:`${oldMessage.channel}`
            },
          ],
        }],
      });
        }
      }
    }
    database.fetchData(`guildID`, `${oldMessage.guild.id}`, `guild_log`, rows => {
      if (rows === undefined) return conErr(`MessageUpdate`, `Краш логи изменения сообщений (0)[0]`);
      if (rows === null) return conErr(`MessageUpdate`, `${oldMessage.guild.id} нет в БД! (1)[0]`);
      if (rows.statusUpdMsg === false || oldMessage.member?.user.bot || newMessage.member?.user.bot || oldMessage.content == newMessage.content) return;
      if (!oldMessage.guild.channels.cache.find(c => c.id === rows.logUpdMsg)) return conErr(`MessageUpdate`, `Я не могу найти канал ${rows.logUpdMsg} на сервере ${oldMessage.guild.name}. (0)[1]`);
      if (!newMessage.guild.members.me.permissionsIn(rows.logUpdMsg).has(emilia.perms[28])) return conErr(`MessageUpdate`, `Я не могу написать в канал ${rows.logUpdMsg} на сервере ${oldMessage.guild.name}. (1)[1]`);
      const logEmbed = {
      author: {
        name: `${oldMessage.author?.tag}`, 
        iconURL: oldMessage.author?.displayAvatarURL({ dynamic: true })},
      timestamp: new Date(),
      footer: {
        text: `ID пользователя: ${oldMessage.author?.id}`
      },
      color: parseInt(`ff6100`, 16)
     };
      //console.log(newMessage.content.length, oldMessage.content.length)
      if (oldMessage.content.length <= 1023 && newMessage.content.length <= 1023) {        
        logEmbed.description = `[Сообщение было изменено](${newMessage.url})`;
        logEmbed.fields = [
          {
            name: `Автор:`, 
            value: `${oldMessage.author}`, 
            inline: true
          }, {
            name: `Канал:`, 
            value: `${oldMessage.channel}`, 
            inline: true
          }, {
            name: `Старое:`, 
            value: `${oldMessage.content || `-__Отсутствует__-`}`
          }, {
            name: `Новое:`, 
            value: `${newMessage.content || `-__Отсутствует__-`}`
          },
        ];
        if (newMessage.attachments.size > 0) {
          logEmbed.fields = [
            {
            name: `Файлы:`, 
            value: `${newMessage.attachments.map((a) => a.url)}`
          },
        ];
        }
        newMessage.guild.channels.cache.get(rows.logUpdMsg).send({embeds: [logEmbed]});
      } else if (oldMessage.content.length >= 1024 || newMessage.content.length >= 1024) {
        logEmbed.description = `[Сообщение было изменено](${newMessage.url})\n**Старое**:\n${oldMessage.content || `-__Отсутствует__-`}`;
        newMessage.guild.channels.cache.get(rows.logUpdMsg).send({embeds: [logEmbed, {
        description: `**Новое**:\n${newMessage.content || `-__Отсутствует__-`}`,
        color: parseInt(`ff6100`, 16),
        fields: [
          {
            name: `Автор:`, 
            value: `${oldMessage.author}`
          }, {
            name: `Канал:`, 
            value:`${oldMessage.channel}`
          },
        ],
      }],
    });
      }
    });//БД логи
  }
}