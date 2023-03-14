const { config_private_voiсe: config, conErr, conLog, time } = require("../../../config.js");
const { Connect, ViewChannel, SendMessages, Speak } = require(`discord.js`).PermissionsBitField.Flags;

module.exports = (newVoice, client) => {
    const { database } = require(`../../../Database/database.js`);

    if (newVoice.guild.channels.cache.find(c => c?.id == config.category_id)) {
        if (!newVoice.guild.channels.cache.find(c => c?.id == config.channel_id)) return conErr(`Private Channel`, `Не выбран канал для создания приватных каналов!`);
        if (newVoice.channel?.id == config.channel_id) {
            if (newVoice.member.bot) {
                if (oldVoice.channel == undefined) return newVoice.member.disconect();
                return newVoice.setChannel(oldVoice.channel.id);
            } else {
            newVoice.guild.channels.create({
                name: `${newVoice.member.displayName}'s channel`,
                type: 2,
                parent: config.category_id,
                permissionOverwrites: [{
                    id: newVoice.member.user.id,
                    allow: [ Connect, ViewChannel, SendMessages, Speak ],
                }, {
                    id: newVoice.guild.id,
                    allow: [ ViewChannel ],
                    deny: [ Connect, SendMessages ],
                }],
            }).then(vc => {
                newVoice.setChannel(vc.id);
                database.upsertData({ id: `${vc.id}`, owner: `${newVoice.member.user.id}`, guild: `${vc.guild.id}` }, `private_voice`, g => {
                    if (g === undefined) return conErr(`Private Voice`, `Произошла ошибка при добавлении канала в БД.`);
                    if (typeof g != `object`) return conErr(`Private Voice`, `g не оказался object`);
                    conLog(`Private Channel`, `Был создан ${vc.name} канал на сервере ${vc.guild.name}`);
                    vc.send({embeds: [{
                        description: `Создан голосовой канал: <#${vc.id}>\nВладелец: ${newVoice.member.user}\n\nДля настройки голосового канала используйте кнопки ниже.`,
                        color: newVoice.guild.members.me.displayColor,
                    }], 
                        components: [{
                            type: 1,
                            components: [{
                                type: 2,
                                style: 1,
                                label: `edit name`,
                                custom_id: `voice.but_name`,
                            }, {
                                type: 2,
                                style: 1,
                                label: `bitrate`,
                                custom_id: `voice.but_bitrate`, 
                            }, {
                                type: 2,
                                style: 1,
                                label: `public`,
                                custom_id: `voice.but_public`,
                            }, {
                                type: 2,
                                style: 1,
                                label: `private`,
                                custom_id: `voice.but_private`,
                            }],
                        }, {
                            type: 1,
                            components: [{
                                type: 2,
                                style: 1,
                                label: `lock`,
                                custom_id: `voice.but_lock`,
                            }, {
                                type: 2,
                                style: 1,
                                label: `kick`,
                                custom_id: `voice.but_kick`,
                            }, {
                                type: 2,
                                style: 1,
                                label: `mute`,
                                custom_id: `voice.but_mute`
                            }, {
                                type: 2,
                                style: 1,
                                label: `deaf`,
                                custom_id: `voice.but_deaf`,
                            }],
                        }, {
                            type: 1,
                            components: [{
                                type: 2,
                                style: 1,
                                label: `add`,
                                custom_id: `voice.but_add`,
                            }, {
                                type: 2,
                                style: 1,
                                label: `role`,
                                custom_id: `voice.but_role`,
                            }, {
                                type: 2,
                                style: 1,
                                label: `owner`,
                                custom_id: `voice.but_owner`,
                            }, {
                                type: 2,
                                style: 1,
                                label: `send`,
                                custom_id: `voice.but_send`,
                            }],
                        }],
                    });
                });
            }).catch(err => conErr(`Private Voice`, err));
            }
        } else {
            database.fetchData(`id`, `${newVoice.channel?.id}`, `private_voice`, pr => {
                if (pr === undefined) return conErr(`Private Voice`, `Произошла ошибка при проверке на наличие голосового в БД!`);
                if (pr !== null) {
                    const owner = {
                        on: false,
                        id: 0,
                    };
                    if (pr?.owner == 0) owner.on = true;
                    if (pr?.owner != 0 && !newVoice.channel.members.find(c => c.id == pr?.owner)) owner.on = true;
                    if (owner.on) {
                    const members = [];
                    members.push(newVoice.channel?.members.filter(f => f.user.bot == false).map(i => i.id));
                        if (members.length < 2) owner.id = newVoice.member.user.id;
                        let random = Math.round(Math.random() * members.length);
                        if (random >= members.length) random -= 1;
                        if (members.length >= 2) owner.id = members[random];
                    database.updatePartialData(newVoice.channel.id, { owner: `${owner.id}` }, `private_voice`, g => {
                            if (g === undefined) return conErr(`Private Voice`, `Произошла ошибка при добавлении овнера канала в БД.`);
                            if (typeof g != `object`) return conErr(`Private Voice`, `g не является object`);
                            conLog(`Private Voice`, `Был выбран новый овнер канала ${newVoice.channel.name} на сервере ${newVoice.guild.name}`);
                        });
                    }
                }
            });

        }
    } else return conErr(`Private Voice`, `Не выбрана категория для приватных каналов!`) //Позже добавлю проверку с другой таблицы
}