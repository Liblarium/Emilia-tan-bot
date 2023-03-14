const { Routes, REST } = require(`discord.js`);
const { prefix, clientId, guildId } = require(`../../config.js`).config_client;
require(`dotenv`).config();
module.exports = {
    name: `ready`,
    async execute (emilia) {
      console.log(`[${emilia.times()}][Система | Бот]: ${emilia.user.username} включена`);
      const rest = new REST({   version: `10` }).setToken(process.env.TOKEN);

      const slashComms = emilia.slashcommands.map(i => i.data);
      let b = 0;
    function myStatus () {
      const stat = [`Dark Souls 2`, `Изучение JavaScript`, `Чтение Базы Данных`, `Lucu Got Problems`, `Dota 2`, /*`Занимается чаепитием с своей женой (${emilia.guilds.cache?.get(`451103537527783455`).members?.cache.find(m => m.id === `304966552057413633`)?.nickname || emilia.guilds.cache?.get(`451103537527783455`).members?.cache.find(m => m.id === `304966552057413633`)?.user?.username})`*/];
      const rn_stat = stat[Math.floor(Math.random() * stat.length)]
      emilia.user.setActivity(`${rn_stat}`)
      console.log(`[${emilia.times()}][${emilia.user.username} | Статус]: Я обновила статус. (${b++}) [${stat.indexOf(rn_stat)}]`);
    }
    let time_upd = 1000 * 60 * 60 * 1;
    rest.put(Routes.applicationCommands(clientId, guildId), { body: slashComms }).then((data) => {
      console.log(`[${emilia.times()}][Система | Comms]: Загружено ${emilia.commands.map(i => i).length} команд`);
      console.log(`[${emilia.times()}][Система | Slash]: Зарегестрировано ${data.length} команд`);
      console.log(`[${emilia.times()}][Система | Event]: Загружено ${emilia.events.map(i => i).length} евентов`);
      console.log(`[${emilia.times()}][${emilia.user.username} | Работа]: Стандартный прекфикс: ${prefix}`);
      myStatus()
    }).catch(err => console.log(err));
    setInterval(myStatus, time_upd);
    }
}