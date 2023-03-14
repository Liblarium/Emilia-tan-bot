const { conErr } = require(`${process.cwd()}/config.js`);
const { prefix } = require(`${process.cwd()}/config.js`).config_client;
const { TestDataBase } = require(`${process.cwd()}/Database/database.js`);
const { allXp, allLvl, allNextLvlXp } = require(`${process.cwd()}/Files/genshin_calculate.js`);
module.exports = {
    name: `genshin`,
    aliases: [`геншин`],
    option: {
        type: `command`,
        delete: true,
        perms: 0,
    },
    description: `Калькулятор. Пока только по рангам`,
    async execute (message, args, commandName, emilia) {

        let Prefix;
        const { pref } = TestDataBase.viewData(`guID`, `${message?.guild?.id}`, `guild_setting`);
        Prefix = pref;
        Prefix ??= prefix;
        if (!args) return message.channel.send({embeds: [{
            title: `${commandName}`,
            description: `Команда для подсчёта ранга приключения. Возможно что-то ещё будет. Подсчёт идёт в 2 типа: \n1. по количеству опыта, \n2. по рангу и опыту.\nПервый тип: ${Prefix}${commandName} опыт|xp опыт (количество).\nВторой тип: ${Prefix}${commandName} ранг|rank уровень (количество) опыт (количество).\n -1 и ниже числа не принимаются. Не числа в полях "уровень" и "опыт" - тоже.`
        }]});
        class Calculator {
            constructor(xp, lvl) {
                this.xp = xp;
                this.lvl = lvl;
            }
            xp (xp) {
                return allXp(xp); //вывод уровня и остатка
            }
            lvl (lvl, xp) {
                return allLvl(lvl); //вывод уровня и остатка
            }
            nextLvl (xp) {
                return allNextLvlXp(xp); //для расчёта опыта
            }
        }
        if ([`опыт`, `xp`].includes(args[0].toLowerCase())) {

        }
    },
}