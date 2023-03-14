const allCateg = require(`./chans.js`).all.categ;
exports.chan_menu_categ = class {
  on(message) {
    return [
  {
    label: `Страница 1`,
    description: `${message.guild.channels.cache.get(allCateg[0])?.name}`,
    value: `val_chan_1`,
  }, {
    label: `Страница 2`,
    description: `${message.guild.channels.cache.get(allCateg[1]).name}`,
    value: `val_chan_2`,
  }, {
    label: `Страница 3`,
    description: `${message.guild.channels.cache.get(allCateg[2]).name}`,
    value: `val_chan_3`,
  }, {
    label: `Страница 4`,
    description: `${message.guild.channels.cache.get(allCateg[3]).name}`,
    value: `val_chan_4`,
  }, {
    label: `Страница 5`,
    description: `${message.guild.channels.cache.get(allCateg[4]).name}`,
    value: `val_chan_5`,
  }, {
    label: `Страница 6`,
    description: `${message.guild.channels.cache.get(allCateg[5]).name}`,
    value: `val_chan_6`,
  }, {
    label: `Страница 7`,
    description: `${message.guild.channels.cache.get(allCateg[6]).name}`,
    value: `val_chan_7`,
  }, {
    label: `Страница 8`,
    description: `${message.guild.channels.cache.get(allCateg[7]).name}`,
    value: `val_chan_8`,
  }, {
    label: `Страница 9`,
    description: `${message.guild.channels.cache.get(allCateg[8]).name}`,
    value: `val_chan_9`,
  }, {
    label: `Страница 10`,
    description: `${message.guild.channels.cache.get(allCateg[9]).name}`,
    value: `val_chan_10`,
  }, {
    label: `Выбор каналов`,
    description: `Выбор каналов на включение/выключение`,
    value: `val_chan_opt`,
  }, {
    label: `Закрыть`,
    description: `Удалить это сообщение`,
    value: `val_chan_x`,
  }]
    }
} 
exports.chan_menu_chan = class {
    on(message) {
    return [{
    label: `пусто`,
    description: `Пока пусто, ${message.member.user.tag}`,
    value: `val_pusto`
  }]
    }
};
exports.chan_values = [
  { 
    label: `Выключить`,
    description: `Убрать лишние каналы/категории с списка`,
    value: `val_chan_off`
  },
  {
    label: `Включить`,
    description: `Вернуть отключенные каналы/категории с списка`,
    value: `val_chan_on`
  }
];