const Discord = require(`discord.js`);
const emilia = new Discord.Client({ intents: 131071, partials: [ Discord.Partials.Channel], shards: `auto` });
const { Perms } = require(`./perms.js`);
const { database, aidb } = require(`./Database/database.js`);
const data = require(`date-and-time`);
emilia.data = data;
aidb;
require(`dotenv`).config();
require(`./Database/mongo.js`)();
//require(`./jointocreate.js`)(emilia);
emilia.commands = new Discord.Collection();
emilia.slashcommands = new Discord.Collection();
emilia.events = new Discord.Collection();
require(`./handlers`)(emilia);
const { AddReactions, Administrator, AttachFiles, BanMembers, ChangeNickname, Connect, CreateInstantInvite, CreatePrivateThreads, CreatePublicThreads, DeafenMembers, EmbedLinks, KickMembers, ManageChannels, ManageEmojisAndStickers, ManageEvents, ManageGuild, ManageMessages, ManageNicknames, ManageRoles, ManageThreads, ManageWebhooks, MentionEveryone, ModerateMembers, MoveMembers, MuteMembers, PrioritySpeaker, ReadMessageHistory, RequestToSpeak, SendMessages, SendMessagesInThreads, SendTTSMessages, Speak, Stream, UseApplicationCommands, UseEmbeddedActivities, UseExternalEmojis, UseExternalStickers, UseVAD, ViewAuditLog, ViewChannel, ViewGuildInsights } = Discord.PermissionsBitField.Flags;
emilia.Discord = Discord;
emilia.Perms = Perms;
emilia.database = database;
emilia.times = () => {
    let hour = new Date().getHours(); 
    let minute = new Date().getMinutes();
    let second = new Date().getSeconds();
    if (new Number(hour) < 10) hour = `0${hour}`;
    if (new Number(minute) < 10) minute = `0${minute}`;
    if (new Number(second) < 10) second = `0${second}`;
    return `${hour}:${minute}:${second}`;
};
const perms = [
    AddReactions, //0
    Administrator, //1
    AttachFiles, //2
    BanMembers, //3
    ChangeNickname, //4
    Connect, //5
    CreateInstantInvite, //6
    CreatePrivateThreads, //7
    CreatePublicThreads, //8
    DeafenMembers, //9
    EmbedLinks, //10
    KickMembers, //11
    ManageChannels, //12
    ManageEmojisAndStickers, //13
    ManageEvents, //14
    ManageGuild, //15
    ManageMessages, //16
    ManageNicknames, //17
    ManageRoles, //18
    ManageThreads, //19
    ManageWebhooks, //20
    MentionEveryone, //21
    ModerateMembers, //22
    MoveMembers, //23
    MuteMembers, //24
    PrioritySpeaker, //25
    ReadMessageHistory, //26
    RequestToSpeak, //27
    SendMessages, //28
    SendMessagesInThreads, //29
    SendTTSMessages, //30
    Speak, //31
    Stream, //32
    UseApplicationCommands, //33
    UseEmbeddedActivities, //34
    UseExternalEmojis, //35
    UseExternalStickers, //36
    UseVAD, //37
    ViewAuditLog, //38
    ViewChannel, //39
    ViewGuildInsights, //40
]
emilia.perms = perms;
emilia.login(process.env.TOKEN);
exports.emilia = emilia;
exports.Discord = Discord;
