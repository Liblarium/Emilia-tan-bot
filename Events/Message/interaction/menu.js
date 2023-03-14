class isMenu {
	constructor (type) {
		this.type = type;
	}
async on(type) {
	const { database } = require(`${process.cwd()}/Database/database.js`);
  const { time, conErr } = require(`${process.cwd()}/config.js`);
  const { cre_pers } = require(`${process.cwd()}/Files/config.js`).chan_config.game;
  const { chan_menu_categ, chan_menu_chan } = require(`${process.cwd()}/Files/test.js`);
  const categ_menu = new chan_menu_categ();
  const chan_menu = new chan_menu_chan();
	  let inCustom = type.customId;
  	let inMember = type.member;
  	let inUser = type.user;
  	let inGuild = type.guild;
  	let inMessage = type.message;
  	let inValue = type.values;
    const inCrePers = new cre_pers();
    let blood = () => inCrePers.blood(Math.round(Math.random() * 100));
    class inComponents extends isMenu {
      constructor (num, nums) {
        super (type);
        this.num = num;
        this.nums = nums;
      }
      /**
       * 
       * @param {number} num позиция в массиве. От 0 
       * @description Компоненты сообщения
       */
      message(num) {
        num ??= 0;
        inMessage.components[num] ??= inMessage.components[0];
        return inMessage.components[num]
      }
      /**
       * 
       * @param {number} num позиция в массиве. От 0 
       * @description Компоненты интеракции
       */
      interaction(num) {
        num ??= 0;
        type.components[num] ??= type.components[0];
        return type.components[num]
      }
      /**
       * 
       * @param {number} num позиция в массиве. От 0 
       * @param {number} nums вторая позиция в массиве. От 0
       * @description полный путь к копонентам сообщения с их изменением в процессе
       */
      mesComponent(num, nums) {
        num ??= 0;
        nums ??= 0;
        inMessage.components[num] ??= inMessage.components[0];
        inMessage.components[num].components[nums] ??= inMessage.components[num].components[0];
        return inMessage.components[num]?.components[nums].data;
      }
      /**
       * 
       * @param {number} num позиция в массиве. От 0 
       * @param {number} nums вторая позиция в массиве. От 0
       * @description полный путь к копонентам интеракции с их изменением в процессе
       */
      intComponent(num, nums) {
        num ??= 0;
        nums ??= 0;
        type.components[num] ??= type.components[0];
        type.components[num].components[nums] ??= type.components[num].components[0];
        return type.components[num]?.components[nums].data;
      }
    }
    const inComponent = new inComponents();
    class inReplys extends menu {
      constructor (types, text, comp) {
        super(type);
        this.types = types;
        this.text = text;
        this.comp = comp;
        type ??= 1
        comp ??= undefined;
      }
    /**
     * 
     * @param {number} num тип ответа. Число от 1 до 5 
     * @param {string | object} txt Сообщение | Embed сообщение
     * @param {object} comp Компоненты сообщения (Кнопки | Меню | Окна)
     * @description Мини класс для ответа.
     */
      on(types, text, comp) {
        if (types == 1) {
          return type.reply({content: `${text}`, ephemeral: true});
        } else if (types == 2) {
          return type.reply({embeds: [text], ephemeral: true});
        } else if (types == 3) {
         return type.reply({text, ephemeral: true})
        } else if (types == 4) {
          return type.reply({embeds: [text], components: [comp], ephemeral: true});
        } else if (types == 5) {
          return type.reply({text, components: [comp], ephemeral: true});
        } else if (![1, 2, 3, 4, 5].includes(types)) {
         throw new TypeError(`[${time()}][Menu | ERROR]: ${types} не входит в число доступных типов этой функции.`)
       }
      }
    };
    /**
     * 
     * @param {number} num тип ответа. Число от 1 до 5 
     * @param {string | object} txt Сообщение | Embed сообщение
     * @param {object} comp Компоненты сообщения (Кнопки | Меню | Окна)
     * @description Мини функция для сокращения класса
     */
    const inReply = (num, txt, comp) => { 
      return new inReplys().on(num, txt, comp) 
    };
    
	if (inCustom === `sel_test`) {
    if (inValue[0] === `val_test_a` && inValue[1] === `val_test_b`) {
      await type.update({content: `Bruh`, components: []})
    } else if (inValue[0] === `val_test_a`) {
      await type.update({content: `Уже пусто.`, components: []})
    } else if (inValue[0] === `val_test_b`) {
      await type.update({content: `Baka.`, components: []})
    }
  }
  if (inCustom === `sel_chan_var`) {
    if (inValue[0] === `val_chan_on`) {
      type.reply({content: `Yas`, ephemeral: true})
    } else if (inValue[0] === `val_chan_off`) {
      type.reply({content: `No`, ephemeral: true})
    }
  }
  if (inCustom === `sel_chan`) {
    if (inValue[0] === `val_chan_2`) {
      console.log(categ_menu.on(type).filter(f => f.value != inValue[0]))
      inComponent.mesComponent(0, 0).options = inComponent.mesComponent(0, 0).options.filter(f => f.value != inValue[0]).map(i => i);
      inMessage.edit({content: `gg`, components: [inComponent.message(0)]})
      console.log(`val_chan_2`)
    }
    if (inValue[0] === `val_chan_3`) {
      console.log(`Вот`)
    }
  }
  if (inCustom === `sel_g_pers_pol`) {
    let pols = (a) => inCrePers.pers_pol(a);
    let blood = () => inCrePers.blood(Math.round(Math.random() * 100));
  database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, async (sPol) => {
    if (sPol === undefined) {
      return conErr(`SELECT_MENU`, `Создание персонажа | Пол. Краш 2`);
    }
    if (sPol === null) {
      return await inReply(2, {
        title: `Создание персонажа`, 
        description: `Похоже вас не записало в Базу Данных. Обратитесь к администрации бота.`, 
        color: parseInt(`ff2500`, 16)
        }
      )
    }
    if (sPol != null) {
    if (sPol?.пол_игрока.length <= 6) {
      if (inValue[0] === `val_g_pers_guy`) {
    database.updatePartialData(inMember.user.id, { пол_игрока: `${pols(`мужской`)}`}, `gameprofile`, async (upPol) => {
      if (upPol === undefined) {
        return conErr(`SELECT_MENU`, `Создание персонажа | Пол. Краш 3`);
      }
      if (typeof upPol != `object`) {
        return conErr(`SELECT_MENU`, `Создание персонажа | Пол. Краш 4`);
      }
      if (sPol?.родословная.length < 1) {
    database.updatePartialData(inMember.user.id, { родословная: `${blood()}` }, `gameprofile`, async (bloods) => {
      if (bloods === undefined) {
        return conErr(`SELECT_MENU`, `Создание персонажа | Родословная (пол). Краш 1`);
      }
      if (typeof bloods != `object`) {
        return conErr(`SELECT_MENU`, `Создание персонажа | Родословная (пол). Краш 2`);
      }
    });//Запись
      } else {
        return;
      }
      await inReply(2, {
        title: `Создание персонажа`, 
        description: `Пол персонажа: ${pols(`мужской`)}`, 
        color: parseInt(`25ff00`, 16)
        }
      );
    });//Запись
      } else if (inValue[0] === `val_g_pers_woman`) {
    database.updatePartialData(inMember.user.id, { пол_игрока: `${pols(`женский`)}`}, `gameprofile`, async (usPol) => {
      if (usPol === undefined) {
        return conErr(`SELECT_MENU`, `Создание персонажа | Пол. Краш 5`);
      }
      if (typeof usPol != `object`) {
        return conErr(`SELECT_MENU`, `Создание персонажа | Пол. Краш 6`);
      }
        await inReply(2, {
          title: `Создание персонажа`, 
          description: `Пол персонажа: ${pols(`женский`)}`, 
          color: parseInt(`25ff00`, 16)
          }
        );
      if (sPol?.родословная.length < 1) {
    database.updatePartialData(inMember.user.id, { родословная: `${blood()}` }, `gameprofile`, async (bloods) => {
      if (bloods === undefined) {
        return conErr(`SELECT_MENU`, `Создание персонажа | Родословная (Пол). Краш 3`);
      }
      if (typeof bloods != `object`) {
        return conErr(`SELECT_MENU`, `Создание персонажа | Родословная (Пол). Краш 4`);
      }
    });//Запись
      } else {
        return;
      }
    });//Запись
      } else {
        return conErr(`SELECT_MENU`, `Создание персонажа | Пол. Краш 7`);
      }
    } else {
      return await inReply(2, {
        title: `Создание персонажа`, 
        description: `Пол персонажа: ${sPol?.пол_игрока}`, 
        color: parseInt(`25ff00`, 16), 
        footer: { 
          text: `Вы не можете повторно выбрать пол для персонажа!` 
          }
        }
      );
    }
  }
  });//БД профиля
  }
  if (inCustom === `sel_g_pers_race`) {
  database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, rase => {
    if (rase === undefined) {
      return conErr(`SELECT_MENU`, `Создание персонажа | Раса. Краш 2`);
    }
    if (rase === null) {
      return inReply(2, {
        title: `Создание персонажа`, 
        description: `Похоже вас не записало в Базу Данных. Обратитесь к администрации бота.`, 
        color: parseInt(`ff2500`, 16)
        }
      );
    }
    if (rase?.раса_игрока.length >= 3) {
      return inReply(2, { 
        title: `Создание персонажа`, 
        description: `Раса персонажа: ${rase?.раса_игрока}`, 
        color: parseInt(`25ff00`, 16), 
        footer: { 
          text: `Вы не можете повторно выбрать расу для своего персонажа`
          }
        }
      );
    }
    let rChar = inCrePers.rase_char(inValue[0]);
    if (rase != null) {
      let ohNo = { 
        раса_игрока: rChar?.раса_игрока, 
        сила_игрока: rChar?.сила_игрока ? rChar?.сила_игрока : 0, 
        ловкость_игрока: rChar?.ловкость_игрока ? rChar?.ловкость_игрока : 0, 
        точность_игрока: rChar?.точность_игрока ? rChar?.точность_игрока : 0, 
        удача_игрока: rChar?.удача_игрока ? rChar?.удача_игрока : 0, 
        выносливость_игрока: rChar?.выносливость_игрока ? rChar?.выносливость_игрока : 0
      };
  database.updatePartialData(inMember.user.id, ohNo, `gameprofile`, upRase => {
    if (upRase === undefined) {
      return conErr(`SELECT_MENU`, `Создание персонажа | Раса. Краш 3`);
    }
    if (typeof upRase != `object`) {
      return conErr(`SELECT_MENU`, `Создание персонажа | Раса. Краш 4`);
    }
    inReply(2, {
      title: `Создание персонажа`, 
      description: `Раса вашего персонажа: ${rChar?.раса_игрока}`, 
      color: parseInt(`25ff00`, 16)
      }
    );
    if (rase?.родословная.length < 1) {
    database.updatePartialData(inMember.user.id, { родословная: `${blood()}` }, `gameprofile`, async (bloods) => {
      if (bloods === undefined) {
        return conErr(`SELECT_MENU`, `Создание персонажа | Родословная (Раса). Краш 1`);
      }
      if (typeof bloods != `object`) {
        return conErr(`SELECT_MENU`, `Создание персонажа | Родословная (Раса). Краш 2`);
      }
    });//Запись
      } else {
        return;
      }
  });
    }
  });
  }
  if (inCustom === `sel_g_pers_obr`) {
  database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, async (obr) => {
    if (obr === undefined) {
      return conErr(`SELECT_MENU`, `Создание персоная | Обращение. Краш 2`);
    }
    if (obr === null) {
     return await inReply(2, { 
      title: `Создание персонажа`, 
      description: `Похоже вас не записало в Базу Данных. Обратитесь к администрации бота.`, 
      color: parseInt(`ff2500`, 16)
      }
    );//Ответ
    }
    if (obr != null) {
      if (obr?.обращение.length >= 3) {
        return await inReply(2, { 
          title: `Создание персонажа`, 
          description: `Извините. Но повторно изменить обращние можно только с помощью [команды, что сейчас нет] или обратитесь к администрации бота.`,
          color: parseInt(`ff2500`, 16),
          footer: {
            text: `Ваше обращение: ${obr?.обращение}` 
            },
          }
        );//Ответ
      }
    if (obr?.обращение.length <= 2) {
    database.updatePartialData(inMember.user.id, { обращение: inCrePers.obr(inValue[0]) }, `gameprofile`,  upObr => {
        if (upObr === undefined) {
          return conErr(`SELECT_MENU`, `Создание персонажа | Обращение. Краш. 3`);
        }
        if (typeof upObr != `object`) {
          return conErr(`SELECT_MENU`, `Создание персонажа | Обращение. Краш 4`);
        }
        inReply(2, { 
          title: `Создание персонажа`, 
          description: `Обращение к вам: ${inCrePers.obr(inValue[0])}`,
          color: parseInt(`25ff00`, 16),
          }
        );//Ответ
        if (obr?.родословная.length < 1) {
          database.updatePartialData(inMember.user.id, { родословная: `${blood()}` }, `gameprofile`, async (bloods) => {
            if (bloods === undefined) {
              return conErr(`SELECT_MENU`, `Создание персонажа | Родословная (Обращение). Краш 1`);
            }
            if (typeof bloods != `object`) {
              return conErr(`SELECT_MENU`, `Создание персонажа | Родословная (Обращение). Краш 2`);
            }
          });//Запись
            } else {
              return;
            }
      });//Запись
    }
  }
  });//БД профиля
  }
}
};
exports.isMenu = new isMenu;