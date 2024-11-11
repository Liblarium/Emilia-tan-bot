import { BaseEvent } from "@base/event";
import { db, type EmiliaClient } from "@client";
import { Log } from "@log";
import { ChannelType, type VoiceState, PermissionsBitField, type GuildMember } from "discord.js";
import { stringToBigInt } from "@type/util/utils";
import type { ArrayNotEmpty } from "@type";

const { SendMessages, Speak, ViewChannel, Connect } = PermissionsBitField.Flags;
const { GuildVoice } = ChannelType;
const jointocreatemap = new Map();
const categories: ArrayNotEmpty<string> = ["global", "event", "voice"];

export default class VoiceStateUpdate extends BaseEvent {
  constructor() {
    super({
      name: "VoiceStateUpdate",
      category: "bot",
    });
  }

  async execute(oldState: VoiceState, newState: VoiceState, client: EmiliaClient): Promise<any> {

    if (!newState.guild || !newState.member || !oldState.member || oldState.channelId === newState.channelId) return;

    const guildId = stringToBigInt(newState.guild.id);
    const channelId = { new: stringToBigInt(newState.channelId ?? "0"), old: stringToBigInt(oldState.channelId ?? "0") };
    const dbGuild = await db.guild.findFirst({ where: { id: guildId }, select: { id: true, voiceCategory: true, voiceChannel: true } });

    if (!dbGuild || dbGuild.voiceCategory === 0n || dbGuild.voiceChannel === 0n) return;

    new Promise(resolve => {
      setInterval(() => {
        resolve(2);
        try {
          const guild = client.guilds.cache.get(dbGuild.id.toString());

          if (!guild) return;

          const channels = guild.channels.cache.map(ch => ch.id);

          for (const channel of channels) {
            const key = `tempvoicechannel_${guild.id}_${channel}`;

            if (jointocreatemap.get(key)) {
              const vc = guild.channels.cache.get(jointocreatemap.get(key));

              if (!vc || vc.type !== GuildVoice) return;
              if (vc.members.size < 1) {
                jointocreatemap.delete(key);
                setTimeout(async () => {
                  try {
                    await db.privateVoice.delete({ where: { id: stringToBigInt(vc.id) } });
                    return await vc.delete();
                  } catch (err) {
                    return console.error(err);
                  }
                }, 100);
              }
            }
          }
        } catch {
          return;
        }
      }, 10_000);
    });

    /**
     * Creates a new voice channel for the given user in the specified guild and sets
     * the user to the newly created channel.
     *
     * @param {VoiceState} user - The user that joined the voice channel.
     * @returns {Promise<void>}
     */
    async function jointocreatechannel(user: VoiceState): Promise<void> {
      if (user.member?.user.bot) return;

      await user.guild.channels.create({
        name: `${user.member?.user.username}'s канал`,
        type: GuildVoice,
        parent: dbGuild?.voiceCategory.toString(),
      }).then(async vc => {
        if (!user.member || !newState.guild.members.me) return;

        await vc.permissionOverwrites.set([
          {
            id: user.member.user.id,
            allow: [Connect, ViewChannel, SendMessages, Speak],
          },
          {
            id: user.guild.id,
            allow: [ViewChannel],
            deny: [Connect],
          },
        ]);

        user.setChannel(vc);
        jointocreatemap.set(`tempvoicechannel_${vc.guild.id}_${vc.id}`, vc.id);

        await db.privateVoice.create({ data: { id: stringToBigInt(vc.id), guildId, ownerId: stringToBigInt(user.member.user.id) } });

        new Log({ text: `Создан голосовой канал ${vc.name} на сервере ${vc.guild.name}`, type: "info", categories });
        vc.send({
          embeds: [{
            description: `Создан голосовой канал <#${vc.id}>\nВладелец: ${user.member.user.username}\n\nДля настройки голосового канала используйте кнопки ниже`,
            color: newState.guild.members.me.displayColor,
          }],
          components: [{
            type: 1,
            components: [{
              type: 2,
              style: 1,
              label: "edit name",
              custom_id: "voice.but_name",
            }, {
              type: 2,
              style: 1,
              label: "bitrate",
              custom_id: "voice.but_bitrate",
            }, {
              type: 2,
              style: 1,
              label: "public",
              custom_id: "voice.but_public",
            }, {
              type: 2,
              style: 1,
              label: "private",
              custom_id: "voice.but_private",
            }],
          }, {
            type: 1,
            components: [{
              type: 2,
              style: 1,
              label: "lock",
              custom_id: "voice.but_lock",
            }, {
              type: 2,
              style: 1,
              label: "kick",
              custom_id: "voice.but_kick",
            }, {
              type: 2,
              style: 1,
              label: "mute",
              custom_id: "voice.but_mute"
            }, {
              type: 2,
              style: 1,
              label: "deaf",
              custom_id: "voice.but_deaf",
            }],
          }, {
            type: 1,
            components: [{
              type: 2,
              style: 1,
              label: "add",
              custom_id: "voice.but_add",
            }, {
              type: 2,
              style: 1,
              label: "role",
              custom_id: "voice.but_role",
            }, {
              type: 2,
              style: 1,
              label: "owner",
              custom_id: "voice.but_owner",
            }, {
              type: 2,
              style: 1,
              label: "send",
              custom_id: "voice.but_send",
            }],
          }],
        });
      }).catch((e: unknown) => new Log({ text: e, type: "error", categories }));
    }

    let oldparentname = "unknown";
    let oldchannelname = "unknown";
    let oldchanelid = "unknown";
    let oldChannelName: string;
    let newChannelName: string;

    if (oldState?.channel?.parent?.name) oldparentname = oldState.channel.parent.name;
    if (oldState?.channel?.name) oldchannelname = oldState.channel.name;
    if (oldState?.channelId) oldchanelid = oldState.channelId;

    let newparentname = "unknown";
    let newchannelname = "unknown";
    let newchanelid = "unknown";

    if (newState?.channel?.parent?.name) newparentname = newState.channel.parent.name;
    if (newState?.channel?.name) newchannelname = newState.channel.name;
    if (newState?.channelId) newchanelid = newState.channelId;
    if (oldState.channelId) {
      oldChannelName = typeof oldState.channel?.parent === "undefined" ? `-\n\t**${oldchannelname}**\n*${oldchanelid}*` : `${oldparentname}\n\t**${oldchannelname}**\n*${oldchanelid}*`;
    }
    if (newState.channelId) {
      newChannelName = typeof newState.channel?.parent === "undefined" ? `-\n\t**${newchannelname}**\n*${newchanelid}*` : `${newparentname}\n't**${newchannelname}**\n*${newchanelid}*`;
    }

    if (!oldState.channelId && newState.channelId) {
      if (newState.channelId !== dbGuild.voiceChannel.toString()) return;

      jointocreatechannel(newState);
    }

    if (oldState.channelId && !newState.channelId && jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`)) {
      const vc = oldState.guild.channels.cache.get(jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`));

      if (!vc || vc.type !== GuildVoice) return;
      if (vc.members.size < 1) {
        jointocreatemap.delete(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`);
        await db.privateVoice.delete({ where: { id: stringToBigInt(vc.id) } });
        return vc.delete().catch(err => console.error(err));
      }
    }

    if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
      if (newState.channelId === dbGuild.voiceChannel.toString()) jointocreatechannel(oldState);
      if (jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`)) {
        const vc = oldState.guild.channels.cache.get(jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`));

        if (!vc || vc.type !== GuildVoice) return;
        if (vc.members.size < 1) {
          jointocreatemap.delete(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`);
          await db.privateVoice.delete({ where: { id: stringToBigInt(vc.id) } });
          return vc.delete().catch(err => console.error(err));
        }
      }
    }

    if (oldState) {
      const pr = await db.privateVoice.findFirst({ where: { id: channelId.old } });
      if (pr !== null) {
        const members = oldState.channel?.members;
        let errs = 0;

        if (!members) return;

        if (members.size > 0) {
          /**
           * Get a random member from the channel, excluding the bot and the member that left the channel
           * @returns {GuildMember | undefined} The random member
           */
          const randomMember = (): GuildMember | undefined => {
            if (members.size < 1) return;

            const rn = members.random();

            if (!rn || errs > 10) return;

            if (rn.user.bot) {
              errs++;
              return randomMember();
            }
            if (rn.user.id === oldState.member?.user.id) {
              errs++;
              return randomMember();
            }

            return rn;
          };

          const newOwner = randomMember();

          if (!newOwner) return;

          new Log({ text: `Смена владельца приватного канала ${pr.id} на ${newOwner.user.id}`, type: "info", categories });
          await db.privateVoice.update({ where: { id: pr.id }, data: { ownerId: stringToBigInt(newOwner.user.id) } });
        }
      }
    }

    if (newState) {
      if (!newState.channelId || !newState.channel || newState.member.user.bot) return;
      if (newState.guild.channels.cache.find(c => c?.id === dbGuild.voiceCategory.toString())) {
        if (!newState.guild.channels.cache.find(c => c?.id === dbGuild.voiceChannel.toString())) return new Log({ text: "Не выбран канал для голосового чата", type: "error", categories });
        if (newState.channel.id === dbGuild.voiceChannel.toString() && newState.member.user.bot) return oldState.channel === undefined ? newState.disconnect("Бот не может создать приватный канал") : newState.setChannel(oldState.channelId);

        const dbChannel = await db.privateVoice.findFirst({ where: { id: channelId.new } });

        if (!dbChannel) return;

        if (!newState.channel.members.find(c => c?.id === dbChannel.ownerId.toString())) {
          await db.privateVoice.update({ where: { id: dbChannel.id }, data: { ownerId: stringToBigInt(newState.member.user.id) } });
          new Log({ text: `Владельцем приватного канала ${newState.channel.name} назначен ${newState.member.user.id}`, type: "info", categories });
        }
      }
    }
  }

}
