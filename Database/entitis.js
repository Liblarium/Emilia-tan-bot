const { EntitySchema } = require('typeorm');
const guild_log = new EntitySchema({
  name: `guild_log`,
  columns: {
    id: {
      primary: true,
      type: `int`,
      generated: true
    },
    guildID: {
      type: `text`,
    },
    logUpdMsg: {
      type: `text`,
      default: `0`,
    },
    statusUpdMsg: {
      type: `boolean`,
      default: false,
    },
    logDelMsg: {
      type: `text`,
      default: `0`,
    },
    statusDelMsg: {
      type: `boolean`,
      default: false,
    },
    logAddMembr: {
      type: `text`,
      default: `0`,
    },
    statusAddMembr: {
      type: `boolean`,
      default: false,
    },
    logRemMembr: {
      type: `text`,
      default: `0`,
    },
    statusRemMembr: {
      type: `boolean`,
      default: false,
    },
    logCreChannel: {
      type: `text`,
      default: `0`,
    },
    statusCreChannel: {
      type: `boolean`,
      default: false,
    },
    logUpdChannel: {
      type: `text`,
      default: `0`,
    },
    statusUpdChannel: {
      type: `boolean`,
      default: false,
    },
    logRemChannel: {
      type: `text`,
      default: `0`,
    },
    statusRemChannel: {
      type: `boolean`,
      default: false,
    },
    logUpdMembr: {
      type: `text`,
      default: `0`,
    },
    statusUpdMembr: {
      type: `boolean`,
      default: false,
    },
    logCreRoles: {
      type: `text`,
      default: `0`,
    },
    statusCreRoles: {
      type: `boolean`,
      default: false,
    },
    logUpdRoles: {
      type: `text`,
      default: `0`,
    },
    statusUpdRoles: {
      type: `boolean`,
      default: false,
    },
    logDelRoles: {
      type: `text`,
      default: `0`,
    },
    statusDelRoles: {
      type: `boolean`,
      default: false,
    },
    logVoice: {
      type: `text`,
      default: `0`,
    },
    statusVoice: {
      type: `boolean`,
      default: false,
    },
    logEmojiAdd: {
      type: `text`,
      default: `0`,
    },
    statusEmojiAdd: {
      type: `boolean`,
      default: false,
    },
    logEmojiRem: {
      type: `text`,
      default: `0`,
    },
    statusEmojiRem: {
      type: `boolean`,
      default: false,
    },
    logEmojiUpd: {
      type: `text`,
      default: `0`,
    },
    statusEmojiUpd: {
      type: `boolean`,
      default: false,
    },
  },
});

const guild_setting = new EntitySchema({
  name: `guild_setting`,
  columns: {
    id: {
      primary: true,
      type: `int`,
      generated: true
    },
    guID: {
      type: `text`
    },
    pref: {
      type: `text`,
      default: `++`
    },
    defPref: {
      type: `text`,
      default: `++`
    },
    addInBD: {
      type: `boolean`,
      default: `0`
    },
    cmd: {
      type: `int`,
      default: `1`
    },
    logs: {
      type: `int`,
      default: `0`
    }
  }
});

const channels = new EntitySchema({
  name: `channels`,
  columns: {
    id: {
      type: `bigint`,
      primary: true
    },
    chan_name: {
      type: `text`
    },
    chan_type: {
      type: `text`
    },
    chan_status: {
      type: `boolean`
    },
    chan_info: {
      type: `text`
    },
    chan_category: {
      type: `text`
    },
    chan_num: {
      type: `bigint`
    },
  }
})
const users = new EntitySchema({
  name: `users`,
  columns: {
    id: {
      primary: true,
      type: `bigint`
    },
    usrname: {
      type: `text`
    },
    dostup: {
      type: `text`
    },
    dn: {
      type: `text`,
      default: `0`
    },
    info: {
      type: `text`
    },
    pol: {
      type: `text`,
      default: `Не выбран`,
    },
    perms: {
      type: `int`,
      default: 0
    },
    tityl: {
      type: `text`,
      default: `Отсутствует`
    },
    pechenie: {
      type: `text`,
      default: `0`
    },
    name_clan: { //? название "гильдии", где человек состоит
      type: `text`,
      default: `Не состоит`,
    },
    type_clan: { //? тип "гильдии"
      type: `text`,
      default: `Нет данных`,
    },
    positions: { //? должность в "гильдии"
      type: `text`,
      default: `Нет данных`,
    },
    potion: {
      type: `int`,
      default: 0,
    },
    level: {
      type: `bigint`,
      default: 0,
    },
    xp: {
      type: `bigint`,
      default: 0,
    },
    max_xp: {
      type: `bigint`,
      default: 100, //? каждый раз больше в 10 раз      
    },
    day_xp: { //? Это сколько хp было получено сегодня
      type: `bigint`,
      default: 0,
    },
    mes_size: { //? количество сообщений
      type: `bigint`,
    },
    day: {
      type: `text`,
      default: `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`, //? когда был начислен опыт последний раз
    },
  }
});
const game_class = new EntitySchema({
  name: `game_class`,
  columns: {
    id: {
      primary: true,
      type: `int`,
      generated: true,
    },
    name_class: {
      type: `text`
    },
    passive_skill_a: {
      type: `text`
    },
    passive_skill_b: {
      type: `text`
    },
    passive_skill_c: {
      type: `text`
    },
    passive_skill_d: {
      type: `text`
    },
    active_skill_a: {
      type: `text`
    },
    active_skill_b: {
      type: `text`
    },
    active_skill_c: {
      type: `text`
    },
  },
});
const gameprofile = new EntitySchema({
  name: `gameprofile`,
  columns: {
    id: {
      primary: true,
      type: `bigint`,
    },
    имя_игрока: {
      type: `text`
    },
    обращение: {
      type: `text`
    },
    имя_персонажа: {
      type: `text`
    },
    пол_игрока: {
      type: `text`
    },
    возраст_персонажа: {
      type: `bigint`
    },
    раса_игрока: {
      type: `text`
    },
    родословная: {
      type: `text`
    },
    ур_игрока: {
      type: `bigint`
    },
    титул: {
      type: `text`,
      default: `Отсутствует`
    },
    дворянский_титул: {
      type: `text`,
      default: `Отсутствует`
    },
    класс_игрока: {
      type: `text`,
      default: `Бесклассовый`
    },
    хп_игрока: {
      type: `bigint`
    },
    макс_хп_игрока: {
      type: `bigint`
    },
    мана_игрока: {
      type: `bigint`
    },
    макс_мана_игрока: {
      type: `bigint`
    },
    голод_игрока: {
      type: `bigint`
    },
    макс_голод_игрока: {
      type: `bigint`
    },
    жажда_игрока: {
      type: `bigint`
    },
    макс_жажда_игрока: {
      type: `bigint`
    },
    локация: {
      type: `text`
    },
    гильдия_игрока: {
      type: `text`,
      default: `Отсутствует`
    },
    ранг_гильдии: {
      type: `text`,
      default: `Вне гильдии`,
    },
    професия_игрока: {
      type: `text`,
      default: `безработный`
    },
    фракция: {
      type: `text`,
      default: `Отсутствует`
    },
    навыки_игрока: {
      type: `bigint`
    },
    баланс_игрока: {
      type: `bigint`
    },
    инвентарь: {
      type: `bigint`
    },
    макс_инв_место_игрока: {
      type: `bigint`
    },
    вес_инв_игрока: {
      type: `bigint`
    },
    макс_инв_вес_игрока: {
      type: `bigint`
    },
    атака_игрока: {
      type: `bigint`
    },
    сила_игрока: {
      type: `bigint`
    },
    меткость_игрока: {
      type: `bigint`
    },
    точность_игрока: {
      type: `bigint`
    },
    интелект_игрока: {
      type: `bigint`
    },
    мудрость_игрока: {
      type: `bigint`
    },
    удача_игрока: {
      type: `bigint`
    },
    защита_игрока: {
      type: `bigint`
    },
    выносливость_игрока: {
      type: `bigint`
    },
    божественность_игрока: {
      type: `bigint`
    },
    предрасположенность_игрока: {
      type: `bigint`
    },
    концентрация_игрока: {
      type: `bigint`
    },
    ловкость_игрока: {
      type: `bigint`
    },
    усталость_игрока: {
      type: `bigint`
    },
    травмы: {
      type: `text`,
      default: `Отсутствуют`
    },
  }
});

const game_race = new EntitySchema({
  name: `game_race`,
  columns: {
    id: {
      primary: true,
      type: `bigint`,
    },
    name_rase: {
      type: `text`,
    },
    dexterity: {
      type: `bigint`
    },
    strength: {
      type: `bigint`
    },
    endurance: {
      type: `bigint`
    },
    intelligence: {
      type: `bigint`
    },
    spirit: {
      type: `bigint`
    },
    eloquence: {
      type: `bigint`
    },
    wisdom: {
      type: `bigint`
    },
    luck: {
      type: `bigint`
    },
    accuracy: {
      type: `bigint`
    },
    mastery: {
      type: `bigint`
    },
    attractiveness: {
      type: `bigint`
    },
    divinity: {
      type: `bigint`
    },
    concentration: {
      type: `bigint`
    },
    total_amount: {
      type: `bigint`
    },
  },
});

const game_skill = new EntitySchema({
  name: `game_skill`,
  columns: {
  id: {
    primary: true,
    type: `bigint`,
    generated: true,
  },
  name_skill: {
    type: `text`,
  },
  type_skill: {
    type: `text`,
  },
  rarity: {
    type: `text`,
  },
  dexterity: {
    type: `bigint`,
  },
  strength: {
    type: `bigint`,
  },
  endurance: {
    type: `bigint`,
  },
  concentration: {
    type: `bigint`,
  },
  intelligence: {
    type: `bigint`,
  },
  wisdom: {
    type: `bigint`,
  },
  spirit: {
    type: `bigint`,
  },
  luck: {
    type: `bigint`,
  },
  accuracy: {
    type: `bigint`,
  },
  mastery: {
    type: `bigint`,
  },
  attachment: {
    type: `bigint`,
  },
  eloquence: {
    type: `bigint`,
  },
  divinity: {
    type: `bigint`,
  },
  noteb: {
    type: `text`,
  },
  general_attack: {
    type: `bigint`,
  },
  physical_damage: {
    type: `bigint`,
  },
  mage_damage: {
    type: `bigint`,
  },
  mental_damage: {
    type: `bigint`,
  },
  recovery_hp: {
    type: `bigint`,
  },
  phesical_protection: {
    type: `bigint`,
  },
  mage_protection: {
    type: `bigint`,
  },
  mental_protection: {
    type: `bigint`,
  },
  cooldown_skill: {
    type: `text`,
  },
  stunning: {
    type: `text`,
    default: `НЕТ`,
  },
  working_hours: {
    type: `text`,
  },
  number_of_uses: {
    type: `text`,
  },
  restrictions: {
    type: `text`,
    default: `НЕТ`,
  },
  summon_creature: {
    type: `text`,
    default: `НЕТ`,
  },
  number_summon_creatures: {
    type: `text`,
    default: `НЕТ`,
  },
},
});

const register = new EntitySchema({
  name: `register`,
  columns: {
    id: {
      primary: true,
      type: `bigint`,
      generated: false,
    },
    u_name: {
      type: `text`,
    },
    g_uid: {
      type: `bigint`,
    },
    g_name: {
      type: `text`,
    },
    g_reg: {
      type: `bigint`,
    },
    perms: {
      type: `text`,
    },
  }
});

const test = new EntitySchema({
  name: `test`,
  columns: {
    id: {
      primary: true,
      type: `bigint`,
    },
    codes: {
      type: `text`,
    },
  },
});

const Liblarium_Bunker = new EntitySchema({
  name: `Liblarium_Bunker`,
  columns: {
    id: {
      primary: true,
      type: `bigint`,
      generated: `uuid`,
    },
    uname: {
      type: `text`,
    },
    uid: {
      type: `text`,
    },
    perms: {
      type: `text`
    },
  },
});

const кланы = new EntitySchema({
  name: `кланы`,
  columns: {
    id: { //?ID главы ордена/клана/культа
      primary: true,
      type: `bigint`,
    },
    g_name: {
      type: `text`,
    },
    types: { //?Тип "гильдии" (Клан, Орден, Культ)
      type: `text`,
    },
    members: { //? Участники этой "гильдии"
      type: `text`,
    },
    max_member: { //? Количество юзеров
      type: `bigint`,
      default: 5,
    },
    lvl: { //?Уровень. 1 квота = +1 уровень
      type: `bigint`,
      default: 0,
    },
    upgrade: { //? Квота. Пока 1 Участник = 1 место (5 участников = 5 мест)
      type: `bigint`,
      default: 5,
    },
    upg_max: {//? Максимальные размеры квоты
      type: `bigint`,
      default: 50
    },
    elite_max: { //? Элитные участники "гильдии"
      type: `bigint`,
      default: 5,
    },
    deputy_max: { //? Заместители главы "гильдии"
      type: `bigint`,
      default: 2,
    },
  }
});
const baka = new EntitySchema({
  name: `baka`,
  columns: {
    id: {
      type: `bigint`,
      primary: true
    },
    uname: {
      type: `text`,
    },
    test: {
      type: `longtext`,
      default: JSON.stringify({test: 1})
    }
  }
});
const private_voice = new EntitySchema({
  name: `private_voice`,
  columns: {
    id: {
      type: `bigint`,
      primary: true,
    },
    owner: {
      type: `bigint`,
    },
    guild: {
      type: `bigint`,
    },
  }
});

exports.entitys = [guild_log, guild_setting, users, game_class, gameprofile, game_race, game_skill, register, test, Liblarium_Bunker, кланы, baka, private_voice]