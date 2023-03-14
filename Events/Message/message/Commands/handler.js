const { ChannelType } = require("discord.js");
const { conErr, conLog } = require("../../../../config.js");
const { prefixs } = require(`../prefixs.js`);
const { perms } = require("./perms.js");
const { randomBalance } = require(`../../../../Database/Mongoose`);
/**
 * @param type message 
 * @param con database callback
 * @param client client bot
 */
exports.hander = async (type, con, client) => {
    const { prefix, defPref } = await prefixs(type);
    let bal = true;
    if (type?.guild?.id == `451103537527783455` && type?.channel?.id == `829421957891489825` && [`211144644891901952`, `357203448640307201`].includes(type.member?.user?.id)) {  
        if (type.content.startsWith(`${prefix}`)) bal = false;
        if (type.member.user.bot) return;
        randomBalance(type.member.user.id, type.guild.id, bal);
    }
        require(`../../../../Files/Level`)(type);
        const args = type.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!type.content.startsWith(prefix) || type.author.bot) return;
    if (command && type.channel.type === ChannelType.DM) { return type.react(`❌`).catch(err => conErr(`Message/message/Commands/handler.js`, err)); }
    if (type.channel.type === ChannelType.DM) return;
    if (!command) return conErr(`Commands`, `${type.author.tag} попытался(ась) заюзать ${commandName || prefix} в ${type.guild.name}`);
        command.commandName = commandName;
        perms(type, command, con, args, client);//проверка прав
}
