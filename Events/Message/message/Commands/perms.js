const { ChannelType } = require("discord.js");
const { conErr, config_client, conLog } = require("../../../../config.js");
const { guildId, clientId, ownerId } = config_client;

exports.perms = async (type, coms, con, args, client) => {
    if (coms.permissions) {
    if (type.channel.type != ChannelType.DM) {
        const authorPerms = type.channel.permissionsFor(type.author.id);
    if (!authorPerms || !authorPerms.has(coms.permissions || client.perms[coms.permissions])) return type.channel.send({content: `Увы, но увас нет прав на использование ${commandName}.`}).catch(err => conErr(`Message/message/Commands/perms.js`, err));
    } else coms.permissions = false;
    }
    if (coms.botPerms) {
        if (coms.botPerms == undefined) coms.botPerms = client.perms[28];
        if (!type.channel.permissionsFor(clientId).has(coms.botPerms)) return conErr(`Permissions` ,`У меня нет ${command.botPerms?.join(`, `)} прав в канале ${type?.channel?.name} на сервере ${type?.guild?.name}`), type.react(`❌`);
    }
    if (type.channel.permissionsFor(clientId).has(client.perms[28])) {
        if (coms.option) {
          const { option } = coms;
          option.Permissions = con?.perms;
        if (option?.delete == undefined) option.delete = false;
        if (option?.owner == undefined) option.owner = false;
        if (option?.test == undefined) option.test = false;
        if (option?.testers == undefined) option.testers = [];
        if (option?.perms == undefined) option.perms = 0;
        if (option?.log == undefined) option.log = false;
        if (option?.owned == undefined) option.owned = false;
        if (option?.private == undefined) option.private = false;
        if (option?.Permissions == undefined) option.Permissions = 0;
        if (option.private) {
          if (type.guild.id != guildId) return;
        }
        if (option.owner) {
          if (type.member.user.id != ownerId) return type.react(`❌`).catch(err => conErr(`Message/message/Commands/perms.js`, err)), option.del = false;
        }
        if (option.owned) {
          if (type.member.user.id != type.guild.ownerId) return type.react(`❌`).catch(err => conErr(`Message/message/Commands/perms.js`, err)), option.del = false;
        }
        if (option.test) {
          if (!option.testers.find(u => u.id == ownerId)) { 
            option.testers.push(ownerId); 
          if (!option.testers.includes(type.member.user.id)) return type.react(`❌`).catch(err => conErr(`Message/message/Commands/perms.js`, err)), option.del = false;
          } else {
            if (!option.testers.includes(type.member.user.id)) return type.react(`❌`).catch(err => conErr(`Message/message/Commands/perms.js`, err)), option.del = false;
            console.log(`дюп себя`)
        }
        }
        if (option.perms) {
          if (option.Permissions < option.perms) return type.react(`❌`).catch(err => conErr(`Message/message/Commands/perms.js`, err)), option.del = false;
        }
        if (option.delete) {
          if (type.channel.permissionsFor(clientId).has(client.perms[16])) {
           await type.delete().catch(err => conErr(`Message/message/Commands/perms.js`, err));
          } else {
            conErr(`Perms | Delete_Message`, `Я не могу удалить сообщение в ${type?.channel?.name} на сервере ${type?.guild?.name}`);
          } 
        }
        if (option.log) {
          conLog(`${coms.commandName}`, `${type?.member?.user?.tag} использовал(а) команду в ${type?.channel?.name} на сервере ${type?.guild?.name}`);
        }
        try {
          coms.execute(type, args, coms.commandName, client)
        } catch (error) {
          conErr(`Message/message/Commands/handler.js`, error);
        }
    }
}
}

