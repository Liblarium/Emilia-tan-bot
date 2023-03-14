const n = (f) => { return require(`${process.cwd()}/index.js`).emilia.perms[f]; }
const Discord = require(`discord.js`);
const mongoose = require('mongoose');
const postgres = require(`postgres`);
const fs = require('node:fs');
const { conErr, conLog, config_private_voiсe: config, time } = require(`../../config.js`);
const Voice = require(`@discordjs/voice`);
const Canvas = require(`canvas`);

module.exports = {
    name: `test`,
    aliases: [`ts`],
    botPerms: [ n(28), n(16)],
    option: {
        type: `command`,
        test: true,
        testers: [`357203448640307201`],
        //owner: true,
        delete: true,
    },
    description: `Тестовая команда`,
    async execute (message, args, commandName, emilia) {
    try {
    const { database, aidb: datas } = require(`../../Database/database.js`);
    const { order_form } = require(`../../Files/orders/config.js`);
    const test = require(`../../Files/Oop/test.js`);
    const { allXp, allLvl, allNextLvlXp } = require(`../../Files/genshin_calculate.js`);
    //const pgsql = postgres({host: `localhost`, port: 5432, username: `postgres`, password: `ffffff`, database: `profile`});
    //console.log(allXp(allLvl(59) + 243037), (allLvl(59) + 243037) - allLvl(allXp(allLvl(59) + 243037)));
    //const { config } = require(`${process.cwd()}/Files/config.js`);
    //const { category, all } = require(`${process.cwd()}/Files/chans.js`);
    //const { cre_pers } = require(`${process.cwd()}/Files/config.js`).config.game;
    //const { configs } = require(`${process.cwd()}/Files/orders/config.js`);
    //const { chan_menu_categ, chan_menu_chan } = require(`${process.cwd()}/Files/test.js`);
    //const categ_menu = new chan_menu_categ();
    //const chan_menu = new chan_menu_chan();
    //const allCateg = require(`${process.cwd()}/Files/chans.js`).all.categ;
    //const сPers = new cre_pers();
    /*const r_char = (a) => {
      return сPers.rase_char(a);
    }*/
        /*message.channel.send({
            components: [{
                type: 1, 
                components: [{ 
                    type: 2,
                    label: `тест`,
                    customId: `but_test`,
                    style: 1,
                }],
            }],
        }); */
        /*database.fetchData(`id`, `${message.author.id}`, `users`, usr => {
            console.log(usr.dostup)
        })*/
    //const bruh = {};
    //const omg = bruh.const;
    //bruh.const = 0;
    //const cans = canvas.createCanvas(200, 200)
    //const ctx = cans.getContext('2d');
    //const { trows } = require(`${process.cwd()}/Commands/MyComm/test.js`);
    let i = 0;
    const nani = function () {
      console.log(i++)
    } 
    class no {
      nani(bruh) { return `${bruh} nooo`; }
    }
    const nooo = await database.fetchDataAsync(`id`, `${message.member.user.id}`, `baka`);
    const userOrBot = (i) => {
      if (i.bot) {
          return `bot`;
      } else {
          return `user`;
      }
  }
  const nrol = [`748102803741736960`, `775435163210350602`];
  const nest = message.member.roles.cache.filter(r => [`748102803741736960`, `775435163210350602`].includes(r.id))
  //console.log(message.member.roles.cache.some(r => nrol.includes(r.id)));

  const names = {
    a: { abc: 2 },
    b: { abc: 4 },
    c: { abc: 7 }
  }
  const ggg = { a: { b: { c: { d: { v: { a: { n: { s: 2 } } } } } } } }
  /*const tst = await database.upsertDataAsync({id: `1`, codes: `'${message.guild.members.cache.get(`926989774953283595`)?.user.username}`}, `test`);
  if (typeof tst != `object`) return console.log(`Произошла ошибка`);
  console.log(tst);*/
  //const banMember = message.guild.members.cache.map(i => i.user.id);
  const bbs = {
    a: { ba: 2 },
    b: { d: [ {a: 1}, {a: 2}, {a: 3} ] },
  }
  //console.log(`${bbs.b.d.findIndex(b => b.a == 3)}`)
  //console.log(message.guild.channels?.cache?.get(config.category_id)?.children?.cache?.filter(f => f.id != config.channel_id).find(c => /*c.type == 2 &&*/ c.id == message.channel.id));
  //const ggsa = await database.fetchDataAsync(`id`, `1055890841513775214`, `private_voice`);
  //const sheme = JSON.parse(ggsa.chan);
  //const filterMember = sheme.members.filter(u => u.user.id != message.member.user.id);
  /*message.channel.send({embeds: [{
    description: `Провека\u200AТекста`
  }]})*/
  /*for (let a of JSON.parse(ggsa.chan).members) {
    console.log(a);
    a.user.perms = `user`;
    console.log(a);
  }*/
  //console.log(JSON.parse(ggsa.chan).members.filter(f => f.user.perms == `owner`).length);
  //conLog(`Test`, `${JSON.stringify(maps)}, ${JSON.stringify(bbs)}`)
  /*message.channel.send({components: [{
    components: [{
      custom_id: `but_but_test`,
      label: `test`,
      style: 2,
      type: 2,
    }],
    type: 1,
  }],});*/
  /*const tsts = await database.fetchDataAsync(`id`, `${message.member.user.id}`, `users`);
  console.log(tsts);*/
  /*message.channel.send({components: [{
    components: [{
      custom_id: `but_modal`,
      label: `modal`,
      style: 3,
      type: 2,
    }],
    type: 1,
  }]})*/
  //message.channel.send({embeds: [{description: `Текст`, fields: [{name: `Ф`, value: `b`}]}]})
  //console.log(message.member.presence)
  /*message.channel.send({components: [{
    type: 1,
    components: [{
      type: 2,
      //label: `\u000A`,
      style: 2,
      custom_id: `test.but_test`,
      emoji: {
        id: `1069571675529678848`,
        name: `pen`
      }
    }]
  }]})*/
  //conLog(`Test`, `пока пусто`)
  //console.log(message.member.voice)
  const conVoice = () => {
   return new Voice.joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: `451103537527783455`,
      adapterCreator: message.guild.voiceAdapterCreator,
    });
  };
  /*let n = 0;
  let b = 0;
  const voice = message.guild.channels.cache.filter(f => f.type == 2 && f.members.size > 0).map(i => i.members.size)
  if (voice.length < 2) n = voice[0];
  if (voice.length == 0) n = 0;
  if (voice.length > 1) for (let i = 0; i < voice.length; i++) {
    console.log(i, voice[i])
    b += voice[i];
  }
  console.log(b, voice);*/
  //console.log(message.member.displayAvatarURL({forceStatic: false, extension: `png`, size: 4096}));
  if (args[0] == `ec`) { //тесты экономики монго
    const { getBalance } = require(`../../Database/Mongoose`);
    const storeBalance = getBalance(message.author.id, message.guild.id, bal => {
      if (!bal) return message.channel.send({content: `баланса нет`});
      else return message.channel.send({content: `баланс: ${bal.balance}`});
    });
  }

  
  console.log(`console.log() in 174`/*, ${`2023/02/18` == `2023/02/19`}`*/);

  //const tttts = new Date(new Date().getTime() + 12 * 60 * 60 * 1000)
  /*const canvas = Canvas.createCanvas(1404, 788);
      const ctx = canvas.getContext('2d');
      const bg = await Canvas.loadImage(`${process.cwd()}/Files/canvas/t_pr.png`);
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      ctx.fillStyle = `${message.member.displayHexColor === `#000000` ? `#ee7231`: message.member.displayHexColor}`;
      let sn = 40;
      let sj = 30;
      let sc = 30;
      const name_pers = `Имя: Мия`;
      do {
        ctx.font = `${sn -= 5}px Comfortaa`; //Impact
      } while (ctx.measureText(name_pers).width > canvas.width - 225);
        ctx.fillText(name_pers, 325, 100);
      const pers_vozrast = `Возраст: Null (потом сменю)`;
      do {
        ctx.font = `${sn -= 5}px Comfortaa`;
      } while (ctx.measureText(pers_vozrast).width > canvas.width - 225);
        ctx.fillText(pers_vozrast, 325, 150);
        //надо
        ctx.beginPath();
        //ctx.arc(75, 75, 50, 0, Math.PI * 2, true);
        ctx.arc(175, 175, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        //Ава
        //console.log(message.member.displayAvatarURL({ extension: `png` }));
        const avatar = await Canvas.loadImage(`${message.member.displayAvatarURL({ extension: `png` })}`);
          ctx.drawImage(avatar, 75, 75, 200, 200);
  //const times = new Date(1675259302308 ).getHours() - new Date().getHours();
  const attachment = canvas.toBuffer();
  message.channel.send({embeds: [{
    image: {
      url: `attachment://image.png`
    }
  }],
    files: [{attachment: attachment, name: `image.png`}],
  })*/
  /*const nnnn = `marry.640b3223a824ba44508adaa1`;
  console.log(nnnn, nnnn.slice(0, 6));  */

/*const date = new Date();
  const targetDate = new Date(date.getTime() + 12 * 60 * 60 * 1000);
  const remainingTime = targetDate.getTime() - Date.now();
  const getTimes = () => {
  const hours = Math.floor(remainingTime / (1000 * 60 * 60));
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000); 
  return { hours, minutes, seconds };
  };
  console.log(getTimes());*/
  //datas.fetchData(`id`, `4`, `neural_networks`, g => console.log(g));
  //const datea = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`;
  //const dateb = `${new Date(`2023/02/23`).getFullYear()}/${new Date(`2023/02/23`).getMonth() + 1}/${new Date(`2023/02/23`).getDate()}`;
  //console.log(dateb > datea)
  /*const json = require(`./t.json`); //удалён
  const random = (arr) => {
    let rn = Math.floor(Math.random() * arr.length);
    if (rn == arr.length) rn -= 1;
    return arr[rn];
  }
  const s_l = [`1`, `2`];
  const rn = random(s_l);
  console.log(rn); */
  //message.channel.send({content: `<t:${Math.floor(new Date(1675259302308).getTime() / 1000)}:f>`});
  //зона MongoDB
    /*const { fetchBalance } = require(`../../Database/Mongoose`);
    fetchBalance(message.member.user.id, message.guild.id, ec => {
      if (ec === undefined) return conErr(`Test`, `Произошла ошибка при просмотре баланса`);
      message.channel.send({content: `Баланс ${ec.balance}`});
      conLog(`Test`, `balance: ${ec.balance}, userId: ${ec.userId}`);
    });*/
    
  /*  const Guild = require(`../../Database/Mongo/guild.js`);
    let guildProfile = await Guild.findOne({ guildId: message.guild.id });
    if (!guildProfile) {
      guildProfile = await new Guild({
        _id: mongoose.Types.ObjectId(),
        guildId: message.guild.id,
        guildName: message.guild.name,
        guildIcon: message.guild.iconURL() ? message.guild.iconURL() : `None`,
      });

      await guildProfile.save().catch(err => conErr(`Mongo`, err));
      conLog(`Mongo`, guildProfile);
    } else {
      message.channel.send({content: `id: ${guildProfile.guildIcon}`});
    }
*/
  if (args[0] == `on`) {
    conVoice()
  }
  if (args[0] == `off`) {
    conVoice().destroy();
  }
    /*message.channel.send({content: `Я (<@211144644891901952>) не предоставляю данные услуги, что указаны в этом сообщении. И просьба от меня - не беспокоить эту персону без причины, если вам захотелось пошутить над ней или обратиться не по делу. P.S. Меня в WhatsApp нет`, embeds: [{
      title: `Реклама`,
      description: `Уважаемые студенты!\nГотова помочь за небольшую плату в написании таких работ как ВКР, курсовая, реферат, отчет по практике и т.д\nРаботы не перепродаю, не скачиваю. Довожу до защиты. Заранее признательна за доверие! WhatsApp +79538233004`,
      footer: {
        text: `Рекламу предоставил Декабрь#2399`,
        iconURL: message.guild.members.cache.get(`867490337780662282`).displayAvatarURL({ dynamic: true }),
      }
    }]})*/
    /*let animals = [
      { species: 'Лев', name: 'Король' },
      { species: 'Кит', name: 'Фэйл' }
    ];
    
    for (let i = 0; i < animals.length; i++) {
      (function(i) {
        this.print = function() {
          console.log('#' + i + ' ' + this.species
                      + ': ' + this.name);
        }
        this.print();
      }).call(animals[i], i);
    }*/
    

    /*function Product(name, price) {
      this.name = name;
      this.price = price;
    
      if (price < 0) {
        throw RangeError('Нельзя создать продукт ' +
          this.name + ' с отрицательной ценой');
      }
    }
    
    function Food(name, price) {
      Product.call(this, name, price);
      this.category = 'еда';
    }
    
    Food.prototype = Object.create(Product.prototype);
    
    function Toy(name, price) {
      Product.call(this, name, price);
      this.category = 'игрушка';
    }
    
    Toy.prototype = Object.create(Product.prototype);
    
    let cheese = new Food('фета', 5);
    let fun = new Toy('робот', 40);
    console.log(cheese, fun);
    */
    /*const selChan = new MessageActionRow()
      .addComponents(
        new Discord.MessageSelectMenu()
        .setCustomId(`sel_chan`)
        .setPlaceholder(`Выбор действия.`)
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(categ_menu.on(message)),
      );*/
      function Oi (nnn) {
       return {
        gg: 1123123,
        asdadsa: 13213,
        n: this.nnn = nnn
        }
     }
     const mes = {
      a: `А`,
      b: `B`,
      c: {
        d: `D`,
        c: `C`,
        s: () => { //stringify кушает function
          return `S`;
        }
      },
     }
     //const stringify = JSON.stringify(mes);
     //const parse = JSON.parse(stringify);
     //console.log(Math.round(Math.random() * 5) -1);
     /*const inventory = {
      "inventory": { 
        "slot_1": null//,
        //"slot_2": null
      }
     }
     const stringify = JSON.stringify(inventory)
     console.log(stringify, typeof inventory, typeof stringify, JSON.parse(stringify))*/
     //console.log(mes, stringify, parse);
     /*message.channel.send({content: `.`, components: [{
      components: [{
        type: 2,
        label: `проверка`,
        style: 5,
        url: `https://discord.com/channels/451103537527783455/829421957891489825/1030468381935149137`,
        emoji: `826029763482091520`,
      }],
      type: 1,
     }],
    });*/
     const status = function (stat) {
      if (stat == "online") {
        return "Онлайн.";
      }
      if (stat == "idle") {
        return "Не на месте.";
      }
      if (stat == "dnd") {
        return "Не беспокоить.";
      }
      if (stat == "offline") {
        return "Оффлайн.";
      }
    }
    let oo = {};
    const ohoho = class {
      on (gg) {
       oo.a = `${gg}, gg`
       return oo.a;
      }
      off (of) {
       oo.b = `${of}, off`
       return oo.b;
        }
      }
    const heh = new ohoho();
    let aa = `0150`;

    let date1 = new Date(message.member.joinedAt);
    let date2 = Date.now();
    let date3 = date2 - date1.getTime();
    let days = Math.floor(date3 / (24 * 3600 * 1000));
    let leave1 = date3 % (24 * 3600 * 1000);
    let hours = Math.floor(leave1 / (3600 * 1000));
    let leave2 = leave1 % (3600 * 1000);
    let minutes = Math.floor(leave2 / (60 * 1000));
    let leave3 = leave2 % (60 * 1000);
    let seconds = Math.floor(leave3 / 1000);
    const num = [0, `01`, 1, 3, 4, 5];
    const name = {}
    const pakets = (t, p, n) => {
      if (t == 1) { //пакеты
        if (p == 1) { //начальный 4х пакет
          return `Твердотопливных буров: ${n * 1}, твердотопливных манипуляторов: ${n * 2} (${(n * 1) / 2} | ${(n * 2) / 2})`;
        }
      }
      if (t == 2) { //буры
        if (p == 1) { //твердотопливный бур
          name.ironA = n * 4;
          name.medA = n * 3;
          name.ironB = n * 3;
          const { ironA, medA, ironB } = name;
          return `Моторов: ${n * 1}, Каменных блоков: ${n * 4}, Железа: ${ironA} (Всего: железо: ${ironA + ironB}, медь: ${medA}, каменные блоки: ${n * 4}, моторы: ${n * 1})`;
        }
      }
    }
    if ([`say`, `s`].includes(args[0])) {
      if (!args.slice(1)) return conErr(commandName, `args[1] пустой!`);
      message.channel.send({embeds: [{
        description: `\u000A${args.slice(1).join(` `)}`,
        color: message.member.displayColor,
      }]})
    }
      //message.channel.send({embeds: [ {image: {url: message.member.user.avatarURL({dynamic: true})}}]})
      if (args[0] === `ft`) {
        message.channel.send(`${pakets(args[1], args[2], args[3])}`);
      }
    /*await database.fetchAllData(`baka`, test => {
     if (test === undefined) return console.log(`Краш`);
      console.log(order_form(test[0].test));
     });*/
      //console.log(message.guild.channels.cache.get(`447389594791444503`).children.cache.map(i => i.name))
    //message.channel.send(`days: ${days}, hours: ${hours}, minutes: ${minutes}, seconds: ${seconds}`);
    //message.channel.send({embeds: [{ description: `a`, color: `#ffffff`}]})
    //let hehe = () => сPers.blood(Math.round(Math.random() * 100));
    //let rChar = сPers.rase_char(`Человек`);
    //let ohNo = {раса_игрока: rChar?.раса_игрока, сила_игрока: rChar?.сила_игрока ? rChar?.сила_игрока : 0, ловкость_игрока: rChar?.ловкость_игрока ? rChar?.ловкость_игрока : 0, точность_игрока: rChar?.точность_игрока ? rChar?.точность_игрока : 0, удача_игрока: rChar?.удача_игрока ? rChar?.удача_игрока : 0, выносливость_игрока: rChar?.выносливость_игрока ? rChar?.выносливость_игрока : 0};
      //console.log(`Test: ${сPers.rase_char(`человек`)?.раса_игрока}`);
    //console.log(hehe());
    //conErr(commandName, `Проверка команды`)
   //console.log(message.content)
    /*message.channel.send({components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton()
      .setCustomId(`but_verif`)
      .setStyle(`PRIMARY`)
      .setLabel(`Это Модальное окно`))]});*/
    //message.channel.send(`${message.guild.iconURL()}`)
   /*message.channel.send({embeds: [{
    author: {name: `Touhou.land`, iconURL: `https://cdn.discordapp.com/icons/795606016728760320/21d925a2513ea3ba2177c28e90fc4d25.png?size=1024`, url: `https://discord.gg/rjXsGZAkPy`},
    description: `Небольшой тохо сервер с разнообразной тематикой: игры, аниме, ивенты и просто хорошее общение. У нас есть свой бот благодоря которому прибывание на сервере становится веселей. Не обязательно разбираться во вселенной TouHou. [Заходи](https://discord.gg/rjXsGZAkPy) будет весело <3`
   }], components: [new Discord.MessageActionRow()
    .addComponents(new Discord.MessageButton()
    .setLabel('Сервер Touhou.land')
    .setStyle(`LINK`)
    .setURL(`https://discord.gg/rjXsGZAkPy`),
    new Discord.MessageButton()
    .setLabel(`Сайт, где можно поставить лайк на сервер)`)
    .setStyle(`LINK`)
    .setURL(`https://mon.lv/touhouland`))]});*/
/*      database.fetchData(`id`, `${message.member.user.id}`, `кланы`, clans => {
        if (clans === undefined) return console.log(`Краш 0`)
        let mbr = [];
        //const auf = JSON.stringify(clans.members);
        console.log(clans);
      });*/
      //console.log(commandName)
      /*message.channel.send({embeds: [{
      title: `Сайты для чтения манги. Возможно будет ещё`,
      description: `**Сайты**:\n[ReManga](https://remanga.org)\n[MangaLib](https://mangalib.me/)\n[NewManga](https://newmanga.org/)\n[manga_ovh](https://manga.ovh/)\n[Senkuro(Beta)](https://beta.senkuro.com/)\n[Mangahub](https://mangahub.ru/)`,
      timestamp: new Date()}]})*/

   /* message.channel.send({embeds: [new Discord.MessageEmbed()
    .setDescription(`Проверка`)]}).then(msg => console.log(msg)).catch(err => console.log(err));*/
    //const a1 = [0, 1 , 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    //console.log(message.guild.channels.cache.get(`811236822444277780`).children/*.filter(f => f.id != `809890934762242059`)*/.map(i => i.name))
    //message.channel.send({content: `текст`, components: [selChan]})
    //const needRoles = ['802974567756201994', '748102803741736960', '819660106945003548', `719220386549465118`]
    //const hasRoles = message.member._roles.map(i => i)
    //const filteredRoles = needRoles.filter(f => hasRoles.includes(f))
    //if (filteredRoles.length === needRoles.length) {
    //  console.log(`yes`)
    //} else console.log(`no`);
    //console.log(EvMess);
    //message.channel.send({components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setStyle(`SUCCESS`).setCustomId(`bruh_test`).setLabel(`тыкни на меня`))]});
    //class dostup { //класс для измененния уровня доступа в зависимости от наличия нужной роли.
      /**@description Я тут запишу нужные мне вещи. позже уберу
         @param {Гость} Гость
         @param {Пустые} Пользователь
         @param {Чтец} Чтец
         @description Слова после Чтеца идут при наличии роли чтеца
         @param {d1} d1
         @param {d2} d2
         @param {d3} d3
      */
     /* constructor (roleID) {
        this.roleID = roleID;
      }
      on(roleID) {
        if (roleID.some(r => r.id === `809884813938262067`)) { //сначала читает эту
          return console.log(`Гость`)
        } else if (roleID.some(r => r.id === `815559081686859796`)) { //если роли выше нет, то читает эту
          return console.log(`Юзер`)
        } else if (roleID.some(r => [`821524602479706112`, `748102803741736960`].includes(r.id))) { //пофиксить это
          return console.log(`D3`)
        } else if (roleID.some(r => [`781582704617455646`, `748102803741736960`].includes(r.id))) { //тоже
          return console.log(`D2`)
        } else if (roleID.some(r => [`775435163210350602`, `748102803741736960`].includes(r.id))) {//тоже
          return console.log(`D1`)
        } else if (roleID.some(r => r.id === `748102803741736960`)) { //тоже
          return console.log(`Чтец`)
        } else if (roleID.some(r => r.id === `802974567756201994`)) {//тоже
          return console.log(`Автор`)
        } else return console.log(`Не найдено`); //если обеих нет, то пишет это
      }
    }*/
    //console.log(message.member._roles.some(r => r.id === `809884813938262067`))
    //console.log(message.member.roles.cache.some(r => r.id === `809884813938262067`), message.guild.roles.cache.get(`809884813938262067`).name)
    //new dostup().on(message.member.roles.cache);
    //console.log(message);
    /*message.guild.members.cache.forEach((i) => {
      database.fetchData(`id`, `${i.user.id}`, `users`, usr => {
        if (usr === undefined) return console.log(`Краш ${i.user.tag}`);
        if (usr === null) {
      database.upsertData({id: i.user.id, usrname: i.user.username, dostup: `Пользователь`, dn: 0, info: `Вы можете изменить **Информация о пользователе** с помощью **++nio**`, tityl: `Отсутствует`}, `users`, upusr => {
        if (upusr === undefined) return console.log(`краш 2 ${i.user.tag}`);
        if (typeof upusr != `object`) return console.log(`Краш 3 ${i.user.tag}`);
        console.log(`[${date.format(new Date(), 'HH:mm:ss')}][${emilia.user.username} | БД]: ${i.user.tag} вписан`);
      });
    } else {
      if (usr.username != i.user.username) {
    database.updatePartialData(i.user.id, {usrname: i.user.username}, `users`, uusr => {
      if (uusr === undefined) return console.log(`Краш 4 ${i.user.tag}`);
      if (typeof uusr != `object`) return console.log(`Краш 5 ${i.user.tag}`);
      console.log(`[${date.format(new Date(), 'HH:mm:ss')}][${emilia.user.username} | БД]: Имя ${i.user.tag} было обновлено`);
    });
      }
    }
  });
});*/
    /*class bruh {
      constructor (text) {
        this.text = text;
      }
      oho (text) {
        return text.channel.send(`heh`)
      }
    }*/
    //console.log(message.guild.members.cache.map(i => i.roles.cache.map(b => b.id)))
  //  new bruh().oho(message);
    /*class bruh {
      constructor () {
        this.nani = `nani`;
        this.lol = `lol`;
      }
      lel() {
        console.log(this.nani);
      }
    }
    const inComponents = class  {
      constructor (num, nums) {
        this.num ??= 0
        this.nums ??= 0
        this.m = `interaction.message`
        this.i = `interaction`
      }
      message (num) {
        return `this.m.components[num]`;
      }
      interaction (num) {
        return `this.i.components[num]`;
      }
      mesComponent (num, nums) {
        return `this.m.components[num].components[nums]`;
      }
      intComponent (num, nums) {
        return `this.i.components[num].components[nums]`;
      }
    }
    const dude = new inComponents();
*/
   // message.channel.send({embeds: [new (require(`discord.js`).MessageEmbed)().setDescription(`Bruh moment`)]});
    //message.member.send({components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setStyle(`DANGER`).setLabel(`Test`).setCustomId(`bruh_but`))]});
    //console.log(message.guild.members.cache.find(m => m.id === `211144644891901952`).user.username)
    /*fs.readFile('Files/canvas/test.png', (err, squid) => {
  if (err) throw err
  const img = new canvas.Image()
  img.onload = () => ctx.drawImage(img, 0, 0)
  img.onerror = err => { throw err }
  img.src = squid
});*/
/*const membeRcount = function() {
  let count = 0;
  const guid = emilia.guilds.cache.map(i => i.memberCount);
  for (let gu of guid) {
    count += gu;
  }
  return count;
}*/
/*const bruh = {
  game: {
    allRase: [`Человек`, `Эльф`, `Гном`, `Орк`, `Демон`, `Гоблин`],
    ollRase: function () {
      let rases = [];
      return rases.concat(this.allRase.map(i => i.toLowerCase()));
    },
    cre_pers: class {
    constructor (text) {
      this.text = text;
      this.allRase = [`Человек`, `Эльф`, `Гном`, `Орк`, `Демон`, `Гоблин`];
      this.ollRase = 6;
    }
      pol (text) {
        if (text.toLowerCase() == `нет`) { return `Создал(а) персонажа:`; }
         if (text.toLowerCase() == `девушка`) { return `Создала персонажа:`; }
         if (text.toLowerCase() == `парень`) { return `Создал персонажа:`; }
        if (![`нет`, `девушка`, `парень`].includes(text.toLowerCase())) return `${text} не входит в число доступных названий!`;
      }
      pers_pol (text) {
        if (text.toLowerCase() == `мужской`) { return `Мужской`; }
        if (text.toLowerCase() == `женский`) { return `Женский`; }
        if (![`мужской`, `женский`].includes(this.text)) return `${text} не входит в число полов`;
      }
      obr (text) {
        if ([`скип`, `пропустить`].includes(text.toLowerCase())) { return `Нет`; }
        if (text.toLowerCase() == `девушка`) { return `Девушка`; }
        if (text.toLowerCase() == `парень`) { return `Парень`; }
        if (![`скип`, `пропустить`, `девушка`, `парень`].includes(text.toLowerCase())) return `${text} не входит в счисло обращений`;
      }
      rase (text) {
        let prof;
        for (let el of this.ollRase()) {
          if (text == el) prof = el;
        }
        if (prof === undefined) return `${text} нет в списке рас!`;
        if (prof != undefined) return this.allRase[this.ollRase.indexOf(prof)];
      }
    },
  }
};
const p = new bruh.game.cre_pers().rase(`человек`);
console.log(p);*/
//console.log(membeRcount())
/*const em = '```';
let profile = message.mentions.members.first() || message.member;
const fun = {
    statu: function (stat) {
        if (stat == `online`) return `онлайн`;
        if (stat == `idle`) return `афк`;
        if (stat == `dnd`) return `не беспокоить`;
        if ([`offline`, undefined].includes(this.stat)) return `не в сети`;
    }
};
const embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`**Профиль - ${profile.user.tag}**`)
        .addFields(
            { name: '> **Статус**', value: `${em}${fun.statu(`${profile.presence?.status}`)}${em}` },
            { name: '> **Присоеденился**', value: `${em}${profile.joinedAt.toLocaleString()}${em}`, inline: true},
            { name: '> **Зарегистрировался**', value: `${em}${profile.user.createdAt.toLocaleString()}${em}`, inline: true})
        .setTimestamp()
message.channel.send({embeds: [embed]});*/
//const test = await message.guild.members.cache.get(`357203448640307201`);
//console.log(message.member.presence.activities);
//console.log(test.map(i => i.user.id))
//console.log(test)
//message.channel.send({embeds: [{description: `${test.user.tag}`}]})
//test.send(`Проверка`).catch (err => {console.log(err)});
//  console.log(message.guild.members.cache.map(i => `${test} - ${i.id}`).join(`, `));
/*
let member = message.guild.members.cache.get(message.member.user.id);
// разметка
const cans = canvas.createCanvas(700, 200); // 700 - Ширина, 200 - Высота
const ctx = cans.getContext('2d'); // Делаем в 2d // 3D трогать не советую
const bg = await canvas.loadImage(`${process.cwd()}/Files/canvas/img.png`); // Библа поддерживает только PNG

ctx.drawImage(bg, 0, 0, cans.width, cans.height);
ctx.strokeStyle = `red`;
ctx.strokeRect(0, 0, cans.width, cans.height);

//Текстовая часть
ctx.fillStyle = `${message.member.displayHexColor === `#000000` ? `#ee7231`: message.member.displayHexColor}`;
let sn = 40;
let sj = 30;
let sc = 30;


let name = message.author.tag;
do {
    ctx.font = `${sn -= 5}px Impact`;
} while(ctx.measureText(name).width > cans.width - 225);
  ctx.fillText(name, 200, 65);
let join = `Присоединился:  ${member.joinedAt.toLocaleString()}`;
do {
    ctx.font = `${sj -= 5}px Impact`;
} while(ctx.measureText(join).width > cans.width - 225);
  ctx.fillText(join, 200, 120);
let create = `Создан:  ${member.user.createdAt.toLocaleString()}`;
do {
    ctx.font = `${sc -= 5}px Impact`;
} while(ctx.measureText(create).width > cans.width - 225);
  ctx.fillText(create, 200, 170);
//Надо
ctx.beginPath();
//ctx.arc(75, 75, 50, 0, Math.PI * 2, true);
ctx.arc(105, 105, 75, 0, Math.PI * 2, true);
ctx.closePath();
ctx.clip();
//Ава
const avatar = await canvas.loadImage(member.displayAvatarURL({format: "png"}));
//ctx.drawImage(avatar, 10, 10, 115, 115);
ctx.drawImage(avatar, 45, 45, 120, 120);
const msg = new Discord.MessageAttachment(cans.toBuffer(), "uInfo.png");
message.channel.send({files: [msg]});
*/


// Write "Awesome!"
/*ctx.font = '30px Impact'
ctx.rotate(0.1)
ctx.fillText('Awesome!', 50, 100)

// Draw line text
const text = ctx.measureText('Awesome!')
ctx.strokeStyle = 'rgba(5,2,2,20)'
ctx.beginPath()
ctx.lineTo(50, 100)
ctx.lineTo(50 + text.width, 102)
ctx.stroke()

// From a buffer:
fs.readFile(`${process.cwd()}/Files/canvas/test.png`, (err, test) => {
  if (err) throw err
  const img = new canvas.Image()
  img.onload = () => ctx.drawImage(img, 0, 0)
  img.onerror = err => { throw err }
  img.src = test
  //console.log(test.toBuffer())
  console.log(img);
});*/

// Draw cat with lime helmet
/*canvas.loadImage(`${message.author.avatarURL({dynamic: false, format: `png`})}`).then((image) => {
  ctx.drawImage(image, 50, 0, 70, 70)
  //console.log(image)
  message.channel.send({files: [new Discord.MessageAttachment(cans.toBuffer())]})
});*/

    /*let g = "```";
    const bruh = `bruh`;
    const dude = {
      gen: {
        G: [`g`,`gggg`, `ggg`],
      gg: {
        g: `g`,
        ggg: `ggg`,
        gggg: `gggg`,
      },
      },
    };*/
    //console.log(dude.gen.G.join(`, `))
    //message.channel.send(`${message.author.createdAt.toLocaleDateString()}`)
    /*database.upsertData({uname: message.author.username, uid: message.author.id, perms: `Игрок`}, `Liblarium_Bunker`, GG => {
      if (typeof GG != `object`) return console.log(`Краш`);
      if (GG === undefined) return console.log(`Краш 2`);
      console.log(`Вписано`);
    });/*
    //console.log(`${config.gids[message.guild.id].table}`);
    //console.log(emilia.guilds.cache.get(`451103537527783455`).members.cache.size )
  /*  const { DiscordTogether } = require('discord-together');
    const disTog = new DiscordTogether(emilia);
    disTog.createTogetherCode(message.member.voice.channelId, `youtube`).then(async(invite) => {
      message.channel.send(`${invite.code}`);
    })*/
    /*class Test {

  constructor(name) {
    // вызывает сеттер
    this.name = name;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (value?.length < 4) throw new SyntaxError("Имя слишком короткое.");

    if (value === undefined) throw new SyntaxError(`Ничего нет!`);

    this._name = value;
  }

}
    const gg = new Test(args[0]);
    console.log(gg?.name);*/
    //const { category } = require(`${process.cwd()}/Files/chans.js`);
    //console.dir(Object.getOwnPropertyNames(category));
    //console.log(message.guild.channels.cache.get(`451103537527783457`).children.filter(f => !emilia.test.modFilt.includes(f.id)).map(i => i.id));
    //console.log(trows)
    /*message.channel.send({components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton()
    .setLabel(`Тест`)
    .setCustomId(`but_test`)
    .setStyle(`DANGER`))]});*/
    //console.log(message.content.length);
    /*database.fetchData(`id`, `${message.guild.id}`, `test`, ts => {
      if (ts === undefined) return console.log(`Краш первой строки`);
      if (ts === null) return console.log(`Этого сервера нет в БД`);
      if (ts.codes.length < 1) {
    database.updatePartialData(`${message.guildId}` ,{codes: `${args.join(` `)}`}, `test`, tt => {
      if (tt === undefined) return console.log(`Краш третьей строки`);
      if (typeof tt != `object`) return console.log(`Краш записи`);
      console.log(`Записано`);
    });
  } else {
    eval(ts.codes)
  }
})*/
    /*message.channel.send({components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton()
    .setStyle(`DANGER`)
    .setLabel(`Текст`)
    .setCustomId(`but_GG`))]});*/
    /*message.member.send(`GGG`).then(msg => {
      const filt = (m, user) => { return user.id != message.author.id; }
      console.log(message.content, 1, message.member.user.tag);
      const collector = msg.channel.createMessageCollector({filter: filt});
      collector.on(`collect`, (m, user) => console.log(m.content, 2, message.author.tag, i++))
    });*/
    /*message.channel.send({embeds: [new Discord.MessageEmbed()
    .setTitle(`Описание ролей с выдачи ролей`)
    .setDescription(`[Игры](https://discord.com/channels/451103537527783455/820048043100864522/966793692302164029)\n\n<@&815559081540583484> - играющие в Terraria\n\n<@&819988307635077144> - играющие в Duck Game\n\n<@&822946765840842752> - для игроков, что играю в гача игры (даёт доступ в <#826821291688198215> и остальные каналы Гача Секции)\n\n<@&862231761559093258> - для играющих в Honkai Impact (даёт доступ к тому-же каналу, что и Waifu collector)\n\n<@&823277095534067732> - для играющих в игры жанра шутер\n\n<@&823277215876644886> - для игроков, что играют в игры Souls Like или подобного жанра\n\n<@&823277194528555008> - для игроков, что играют в жанре Хоррор\n\n<@&823278052820910130> - для игроков, что играют в игры на подобии Кибер Панка\n\n<@&823281220636639242> - для игроков, что играют в жанре фентези\n\n<@&826068341101297716> - для игроков, что играют в osu!\n\n<@&847537291454185513> - для игроков, что играют в CS:GO\n\n<@&847537287575109633> - для игроков, что играют в Dota 2\n\n<@&862231794208342076> - для игроков, что играют в Minecraft\n\n[Прочее](https://discord.com/channels/451103537527783455/820048043100864522/966803926601056357)\n\n<@&813777885784440833> - роль для переводчиков. Категория пылится очень давно\n\n<@&853580609481211914>, <@&875051250528423957> и <@&875051256098463744> - роли, по которым упоминают при раздаче/халяве\n\n<@&872119945650122822> - роль для совместного просмотра аниме. Последний просмотр был в прошлом году\n\n<@&945641778332196894> и <@&945641785194065940> - роли для доступа в <#945642771782438932>\n\n<@&947835078673830038> - люди заинтересованные или являются фанатами вселенной Touhou Project\n\n<@&947836897072410624> - люди заинтересованные или являются фанатами вселенной Невероятных приключений Джо Джо`)
    .setFooter({text: `Описание ролей, что можно взять в #выдача-ролей`, iconURL: message.guild.iconURL()})
    .setColor(message.member.displayHexColor)]})*/
  //  console.log(emilia.guilds.cache.map(i => `Сервер: ${i.name}, ID: ${i.id}`).join(`\n`));
  /*  let row = new Discord.MessageActionRow()
    .addComponents(
      new Discord.MessageSelectMenu()
      .setCustomId(`sel_test`)
      .setPlaceholder(`Тут пока ничего нет. Просто проверка.`)
      .setMinValues(1)
      .setMaxValues(2)
      .addOptions([{
        label: `Тыкни на меня`,
        description: `Описание меню`,
        value: `val_test_a`,
      },{
        label: `Не тыкай на меня`,
        description: `Его тут нет.`,
        value: `val_test_b`,
      },
    ]),
  );
  message.channel.send({content: `Проверка меню`, components: [row]});*/
    /*message.channel.send({embeds: [new Discord.MessageEmbed()
    .setTitle(`Описание ролей`)
    .setDescription(`<@&809884813938262067> - роль гостя. Можно получить при входе.\n<@&815559081686859796> - роль основного уровня доступа. Пока выдаётся вручную.\n<@&748102803741736960> - роль, что открывает [Требуется уровень доступа Чтец или выше]. Не модераторы. Выдаётся по решению <@211144644891901952>.\n**${g}Уровневые Роли${g}**<@&870344465406115871> - Уровень 0-4\n<@&870344470774808596> - Уровень 5-9\n<@&870344474381926451> - Уровень 10-14\n<@&870344478391697489> - Уровень 15-19\n<@&870344485899493416> - Уровень 20-24\n<@&870344490567757854> - Уровень 25-29\n<@&870344495240212551> - Уровень 30-34\n<@&870344500231434300> - Уровень 35-44\n<@&870344504622858270> - Уровень 45-49\n<@&870344510394208287> - Уровень 50-59\n<@&870344519919480962> - Уровень 60-69\n<@&870344524478677052> - Уровень 70-79\n<@&870344525095247882> - Уровень 80-99\n<@&870344532699545700> - Уровень 100-109\n<@&870344536034005023> - Уровень 110-119\n<@&870344536281456761> - Уровень 120-134\n<@&870344546679160892> - Уровень 135-139\n<@&870344550177194024> - Уровень 140-149\n<@&870344554040143903> - Уровень 150+\n**${g}Уровни доступа Чтецов${g}**<@&775435163210350602> - уровень, что открывает новую категорию.\n<@&781582704617455646> - ничего нового не даёт.\n<@&821524602479706112> - видно пару новых каналов.\nДля D4 и D5 ничего не придумала.\n<@&802974567756201994> - автор. Что именно? Узнаете, если будете чтецом.\n<@&724608047862775828> - оружейник холодного оружия.\n<@&826050594842083359> - оружейник огнестрельного оружия.\n\nВ будущем это сообщение будет изменено.`)
    .setFooter({text: `Хранитель Бункерной Библиотеки`, iconURL: message.guild.iconURL()})
    .setColor(message.member.displayHexColor)]})*/
    /*message.guild.members.cache.forEach((i) => {
      let Usr = i.user.id;
      let profile;
      database.fetchData(`id`, `${Usr}`, `users`, usr => {
        if (usr === undefined) throw new Error(`Что-то пошло не так`);
        if (usr === null) {
          if (message.author.bot) {
            profile = { id: `${Usr}`, usrname: `${message.guild.members.cache.get(Usr).user.username}`, dostup: `Бот`, dn: 0, info: `Это бот.`, tityl: `Отсутствует` };
            database.upsertData(profile, `users`, upbot => {
              if (typeof upbot != `object`) throw new Error(`Что-то пошло не так(2)`);
              console.log(`[${date.format(new Date(), 'HH:mm:ss')}][${message.guild.me.user.username} | БД]: бот ${message.guild.members.cache.get(Usr).user.tag} был вписан в БД.`);
            });
          } else {
            profile = { id: `${Usr}`, usrname: `${message.guild.members.cache.get(Usr)}`, dostup: `Гость`, dn: 0, info: `Вы можете изменить **Информация о пользователе** с помощью **++nio**`, tityl: `Отсутствует` };
            database.upsertData(profile, `users`, upuser => {
              if (typeof upuser != `object`) throw new Error(`Что-то пошло не так(3)`);
              console.log(`[${date.format(new Date(), 'HH:mm:ss')}][${message.guild.me.user.username} | БД]: пользователь ${message.guild.members.cache.get(Usr).user.tag} был вписан в БД.`);
          });
        }
        } else {
          console.log(i++)
        }
      });
    });*/

    //console.log(message.member.permissions.has(Perms[11]));
    /*let tes = new MessageButton()
    .setStyle(`DANGER`)
    .setLabel(`Тест`)
    .setCustomId(`but_GG`)
    message.channel.send({content: `GG`, components: [new MessageActionRow().addComponents(tes)]});*/
    /*database.fetchData(`id`, `${message.id}`, `baka`, baka => {
      if (baka === undefined) return console.log(`Краш первой строки`);
      if (baka === null) {
        database.upsertData({id: `${message.id}`}, `baka`, upBaka => {
          if (typeof upBaka != `object`) return console.log(`Краш второй строки`);
          console.log(`записан ${upBaka}`);
        });
      } else {
        console.log(baka.id);
      }
    });*/

      //console.log(rows.length);
      //if (rows[3]?.id === undefined /*|| rows[2]?.id === undefined*/) return console.log(`Краш просмотра`)
     // let i = 0;
      //console.log(`GG || ${rows.length}`)
      //const baka = database.selectDataAsync(`baka`, `id`);
      //console.log()
      /*for (;baka.then(res => {res.length < i }); i++) { //Бессконечность не предел
        baka.then(res => { if (res[i]?.id === undefined) return console.log(`Краш цикла ${i} `); });
        massive.concat(baka.then(res => { res[i]?.id }));
        let miss = proverka(massive);
        console.log(miss);
      }*/
      //console.log(rows[i]?.id);
      // await massive.push(rows[i]?.id);
      //await console.log(proverka(massive));
      //console.log(rows);
      /*database.fetchData(`prof`, `${message.author.id}`, `baka`, rows => {
        if (rows === undefined) return console.log(`Ошибка просмотра БД`);
      if (rows === null) {
        database.upsertData({id: `3`,prof: `${message.author.id}`}, `baka`, rows => {
          if (typeof rows != `object`) return console.log(`Не удалось записать Test`);
          console.log(`Удалось записать`);
        });
      } else return;
    });*/

   // console.log(`Пусто`);
  } catch (err) { 
    console.log(`[${time()}][${emilia.user.username} | ERR]:`, err); 
  };
    }
}