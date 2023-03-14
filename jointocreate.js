const { PermissionsBitField, ChannelType } = require(`discord.js`);
const { ManageChannels, ManageRoles, ViewChannel, Connect } = PermissionsBitField.Flags;
const { GuildVoice } = ChannelType;
const { guild_id, channel_id, category_id } = require(`./config.js`).config_private_voiсe;
const jointocreatemap = new Map();
module.exports = function (client) {
  const description = {
    name: "jointocreate",
    filename: "jointocreate.js"
  }

 new Promise (resolve => {
   setInterval(() => {
     resolve(2);
     try {
       const guild = client.guilds.cache.get(guild_id);
       const channels = guild.channels.cache.map(ch => ch.id)
       for (let i = 0; i < channels.length; i++) {
         const key = `tempvoicechannel_${guild.id}_${channels[i]}`;
         if (jointocreatemap.get(key)) {
           var vc = guild.channels.cache.get(jointocreatemap.get(key));
           if (vc.members.size < 1) {
             jointocreatemap.delete(key);
             setTimeout(() => {
              return vc?.delete().catch(err => console.error(err));;
             }, 100)             
           } else {}
         }
       }
     }catch{}
   }, 10000)
 })


  client.on("voiceStateUpdate", (oldState, newState) => {
    let oldparentname = `unknown`;
    let oldchannelname = `unknown`;
    let oldChannelName;
    let newChannelName;
    let oldchanelid = `unknown`;
    if (oldState && oldState.channel && oldState.channel.parent && oldState.channel.parent.name) oldparentname = oldState.channel.parent.name
    if (oldState && oldState.channel && oldState.channel.name) oldchannelname = oldState.channel.name
    if (oldState && oldState.channelId) oldchanelid = oldState.channelId
    let newparentname = `unknown`;
    let newchannelname = `unknown`;
    let newchanelid = `unknown`;
    if (newState && newState.channel && newState.channel.parent && newState.channel.parent.name) newparentname = newState.channel.parent.name
    if (newState && newState.channel && newState.channel.name) newchannelname = newState.channel.name
    if (newState && newState.channelId) newchanelid = newState.channelId
    if (oldState.channelId) {
      if (typeof oldState.channel.parent !== "undefined") oldChannelName = `${oldparentname}\n\t**${oldchannelname}**\n*${oldchanelid}*`
      else oldChannelName = `-\n\t**${oldchannelname}**\n*${oldchanelid}*`
    }
    if (newState.channelId) {
      if (typeof newState.channel.parent !== `undefined`) newChannelName = `${newparentname}\n't**${newchannelname}**\n*${newchanelid}*`
      else newChannelName = `-\n\t**${newchannelname}**\n*${newchanelid}*`
    }

    if (!oldState.channelId && newState.channelId) {
      if (newState.channelId !== channel_id) return;
      jointocreatechannel(newState);
    }

    if (oldState.channelId && !newState.channelId) {
      if (jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`)) {
          var vc = oldState.guild.channels.cache.get(jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`));
          if (vc.members.size < 1) {
            jointocreatemap.delete(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`);
            return vc.delete().catch(err => console.error(err));
          }
          else {}
      }
    }

  if (oldState.channelId && newState.channelId) {
    if (oldState.channelId !== newState.channelId) {
      if (newState.channelId === channel_id)
      jointocreatechannel(oldState);
      if (jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`)) {
      var vc = oldState.guild.channels.cache.get(jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`));
      if (vc.members.size < 1) {
        jointocreatemap.delete(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`);
        return vc.delete().catch(err => console.error(err));;
      }
      else {}
      }
    }
  }
});
    async function jointocreatechannel(user) {
      await user.guild.channels.create({
        name: `${user.member.user.username}'s канал`,
        type: GuildVoice,
        parent: category_id,
      }).then(async vc => {
        user.setChannel(vc);
        let chanId = new String(vc);
        jointocreatemap.set(`tempvoicechannel_${vc.guild.id}_${vc.id}`, vc.id);
        if (user.guild.channels.cache.get(chanId.slice(2, -1)).members.size == 0) {
          await vc.permissionOverwrites.set([
            {
              id: user.id,
              allow: [ManageChannels, Connect, ManageRoles, ViewChannel],
            },
            {
              id: user.guild.id,
              allow: [ViewChannel],
              deny: [Connect],
            },
          ]);
        }
      })
    }
}
