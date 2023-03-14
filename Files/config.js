const patch = require(`./config.js`);
exports.chan_config = {
  gid: [`451103537527783455`],
  gids: function (guids) {
   this.guids ??= `не указано`
    if (guids === `451103537527783455`) {
      return { 
        id: `451103537527783455`,
        table: `Liblarium_Bunker`,
        name: `Liblarium Bunker`,
        status: true
      }
    }
    if (guids === `334418584774246401`) {
      return { 
        id: `334418584774246401`,
        table: null,
        name: null,
         status: false
    }
  }
    if (![`451103537527783455`, `334418584774246401`].includes(guids)) {
      throw new TypeError(`${this.guids} не входит в число доступных ID серверов!`)
    }
  },
  reg: () => {
    const rnd = (numbr, num) => {
      num ??= 0;
      return new String((Math.floor(Math.random() * numbr) + num));
    }
    return Number.parseInt(rnd(8, 1) + rnd(9) + rnd(9) + rnd(9));
  },
  game: {
    allRase: [`Человек`, `Эльф`, `Гном`, `Дварф`, `Орк`, `Демон`, `Зверолюд`],
    ollRase: () => {
      const { allRase } = patch.chan_config.game;
      let rases = [];
      return rases.concat(allRase.map(i => i.toLowerCase()));
    },
    cre_pers: class {
    constructor (text) {
      const { game } = patch.chan_config;
      this.text = text;
      this.allRase = game.allRase;
      this.ollRase = game.ollRase();
    }
      pol (text) {
        if (text.toLowerCase() == `нет`) { return `Создал(а) персонажа:`; }
         if (text.toLowerCase() == `девушка`) { return `Создала персонажа:`; }
         if (text.toLowerCase() == `парень`) { return `Создал персонажа:`; }
        if (![`нет`, `девушка`, `парень`].includes(text.toLowerCase())) return `${text.slice(0)} не входит в число доступных названий!`;
      }
      pers_pol (text) {
        if (text.toLowerCase() == `мужской`) { return `Мужской`; }
        if (text.toLowerCase() == `женский`) { return `Женский`; }
        if (![`мужской`, `женский`].includes(this.text)) return `Вы уверены, что ${text.slice(0)} есть в списке?`;
      }
      obr (text) {
        if (text === 1) {
          return `Мужчина`;
        }
        if (text === 2) {
          return `Девушка`;
        }
        if (text === 3) {
          return `Нет`;
        }
        if (![1, 2, 3].includes(text)) {
          return new TypeError(`[${date.format(new Date(), 'HH:mm:ss')}][Config | ERROR]: Вы уверены, что ${text} есть в списке?`);
        }
      }
      rase (text) {
        let prof;
        prof = this.ollRase.includes(text);
        if (prof === undefined) {
          return `${this.text?.slice(0)} нет в списке рас!`;
        }
        if (prof != undefined) {
          prof = text;
          return this.allRase[this.ollRase.indexOf(prof)];
        }
      }
      rase_char(text) {
        const { cre_pers } = require(`./config.js`).chan_config.game;
        if (new cre_pers().rase(text.toLowerCase()) == `Человек`) {
          return { раса_игрока: `Человек`, ловкость_игрока: 2, сила_игрока: 2, удача_игрока: 1 };
        } 
        if (new cre_pers().rase(text.toLowerCase()) == `Эльф`) {
          return { раса_игрока: `Эльф`, ловкость_игрока: 3, точность_игрока: 2 };
        }
        if (new cre_pers().rase(text.toLowerCase()) == `Демон`) {
          return { раса_игрока: `Демон`, сила_игрока: 3, выносливость_игрока: 2 };
        }
       if (new cre_pers().rase(text.toLowerCase()) == `Гном`) {
          return { раса_игрока: `Гном`, сила_игрока: 2, выносливость_игрока: 2, ловкость_игрока: 1 };
        }
       if (new cre_pers().rase(text.toLowerCase()) == `Дварф`) {
          return { раса_игрока: `Дварф`, сила_игрока: 2, выносливость_игрока: 3 };
        }
       if (new cre_pers().rase(text.toLowerCase()) == `Орк`) {
          return { раса_игрока: `Орк`, сила_игрока: 4, выносливость_игрока: 1 };
        }
       if (new cre_pers().rase(text.toLowerCase()) == `Зверолюд`) {
          return { раса_игрока: `Зверолюд`, сила_игрока: 2, ловкость_игрока: 2, выносливость_игрока: 1 };
        }
       if (![`Человек`, `человек`, `Эльф`, `эльф`, `Демон`, `демон`, `Гном`, `гном`, `Дварф`, `дварф`, `Орк`, `орк`, `Зверолюд`, `зверолюд`].includes(text)) {
          throw new TypeError(`${text} нет в числе рас`)
        }
      }
      blood (text) {
        /**
        @param {number} text будет числом
        @description "выбор" крови для игрока. Влияет на прокачку. Для регистрации будет доступно ток 4 и 5 тип крови. Родословной, если другими словами. Пока поставлю 50/50. Позже уточню
        */
       if (text <= 50) {
        return `4`;
       }
       if (text >= 51) {
        return `5`;
       }
      }
      age (text) {
        /**
         * @param {number} text число
         * @description возраст персонажа. Не меньше 14 лет. Влияет на обращение к персонажу. Максимального числа нет.
         */
      if (text < 14) {
        return `Персонаж не может иметь возраст меньше 14 лет.`;
      }
      }
    },
  },
}
