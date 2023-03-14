const { conErr, conLog } = require(`../../config.js`);
const { guildId, newMemberRole, prefix } = require(`${process.cwd()}/config.js`).config_client;
const Prefix = prefix;
module.exports = {
  name: `guildMemberAdd`,
  async execute (member, emilia) {
    const { database } = require(`../../Database/database.js`);
    if (member.guild.id == guildId) {
      if (member.bot == true) {
        conLog(`JoinMember`, `Был добавлен бот ${member.user.tag} в бункер.`);
      } else {
        conLog(`JoinMember`, `${member.user.tag} зашёл(а) в бункер.`);
      if (!member.guild.roles.cache.find(r => r.id == newMemberRole)) return conErr(`JoinMember`, `Роль, что указана в конфиге (${newMemberRole}) - не найдена! (0)[0]`);
      let Rols = member.guild.roles.cache.get(newMemberRole);
    	member.roles.add(Rols);
      }
    }
    database.fetchData(`guID`, `${member.guild.id}`, `guild_setting`, guId => {
      let profile;
      let prefix;
      if (guId === undefined) return conErr(`JoinMember`, `Краш настройка входящий юзер. (0)[1]`);
      if (guId != null) prefix = guId.pref;
      if (guId === null) prefix = Prefix;
      if (guId === null) return conErr(`JoinMember`, `${member.guild.name} нет в БД! (1)[1]`);
    database.fetchData(`guildID`, `${member.guild.id}`, `guild_log`, guLog => {
      if (guLog === undefined) return conErr(`JoinMember`, `${member.user.tag} вызвал(а) краш во время входа на сервер ${member.guild.name}. (0)[2]`);
      if (guLog === null) return conErr(`JoinMember`, `${member.guild.name} нет в БД! (1)[2]`);
      if (guLog.statusAddMembr === false) return;
      if (!member.guild.channels.cache.find(c => c.id === guLog.logAddMembr)) return conErr(`JoinMember`, `Я не могу найти канал ${guLog.logAddMembr} на сервере ${member.guild.name} (0)[3]`);
      if (!member.guild.members.me.permissionsIn(guLog.logAddMembr).has(emilia.perms[28])) return conErr(`JoinMember`, `Я не могу написать в канале ${guLog.logAddMembr} на сервере ${member.guild.name} (1)[3]`);
      if (member.bot) {
        member.guild.channels.cache.get(guLog.logAddMembr).send({embeds: [{
          author: {
            name: `${member.user.tag}`, 
            iconURL: member.displayAvatarURL({ dynamic: true })
          },
          description: `${member.user.tag}(${member}) был(а) добавлен(а) на сервер ${member.guild.name}!`,
          fields: [
            { 
              name: `Оболочку бота создали:`, 
              value: `<t:${parseInt(member.user.createdTimestamp / 1000)}> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)`
            },
          ],
          color: parseInt(`25ff00`, 16),
          footer: {
            text: `ID бота: ${member.user.id}`
          },
          timestamp: new Date(),
        }],
      });
      } else {
        member.guild.channels.cache.get(guLog.logAddMembr).send({embeds: [{
          author: {
            name: `${member.user.tag}`, 
            iconURL: member.displayAvatarURL({ dynamic: true })
          },
          description: `${member.user.tag}(${member}) зашёл(а) на сервер ${member.guild.name}!`,
          fields: [
            { 
              name: `Пользователь зарегистрировался в дискорде:`, 
              value: `<t:${parseInt(member.user.createdTimestamp / 1000)}> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)`
            },
          ],
          color: parseInt(`25ff00`, 16),
          footer: {
            text: `ID пользователя: ${member.user.id}`},
          timestamp: new Date(),
        }],
      });
      }
        });//БД логи
      if (guId.addInBD === true) {
        database.fetchData(`id`, `${member.user.id}`, `users`, usrs => {
          if (usrs === undefined) return conErr(`JoinMember`, `Краш юзер входящий юзер. (0-0)[4]`);
          if (usrs === null) {
            if (member.bot == true) { //входящий бот
              profile = { 
                id: `${member.id}`, 
                usrname: `${member.user.username}`, 
                dostup: `Бот`, 
                dn: 0, 
                info: `Это бот.`, 
                tityl: `Отсутствует` 
              };
              database.upsertData(profile, `users`, upUsr => {
                if (upUsr === undefined) return conErr(`JoinMember`, `Краш входящий бот запись. (1-1)[4]`);
                if (typeof upUsr != `object`) return conErr(`JoinMember`, `Не удалось записать бота ${member.user.tag}. (2-1)[4]`);
                conLog(`JoinMember`, `${member.user.tag} был добавлен в БД на сервере ${member.guild.name}!`);
              });//Запись БД боты
            } else if (!member.bot) {
              profile = { 
                id: `${member.id}`, 
                usrname: `${member.user.username}`, 
                dostup: `Гость`, 
                dn: 0, 
                info: `Вы можете изменить **Информация о пользователе** с помощью **${prefix}nio**`, 
                tityl: `Отсутствует` 
              };
                database.upsertData(profile, `users`, uUpUsr => {
                  if (uUpUsr === undefined) return conErr(`JoinMember`, `Краш входящий юзер запись. (1-2)[4]`);
                  if (typeof uUpUsr != `object`) return conErr(`JoinMember`, `Не удалось записать пользователя ${member.user.tag}. (2-2)[4]`);
                conLog(`JoinMember`, `${member.user.tag} был(а) добавлен в БД на сервере ${member.guild.name}!`);
              });//Запись БД юзеры
            } //Если это пользователь
          } else return;//есть ли человек в БД
        });//БД юзера
      } else return; //Записывать ли человека в БД на этом сервере
    });//БД настройка
  },
};
