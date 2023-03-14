const { conErr } = require("../../../../config.js");
const { database } = require("../../../../Database/database.js");

class isButton {
    constructor(type, client) {
        this.type = type;
        this.client = client;
    }
    on(type, client) {
        const inCustom = type.customId;
        const inMember = type.member;
        const inUser = type.user;
        const inGuild = type.guild;
        const inMessage = type.message;
        const inChannel = type.channel;
        const val = { a: false, b: false }
        let colors;
        const inModal = (modals) => {
            return type.showModal(modals);
        };
        const inReply = function (types, text) {
            types ??= `текст`;
            if ([`текст`, 1].includes(types)) {
                return type.reply({ content: `${text}`, ephemeral: true });
            } else if ([`ембед`, 2].includes(types)) {
                return type.reply({ embeds: [text], ephemeral: true });
            } else if ([`оба`, 3].includes(types)) {
                return type.reply({ text, ephemeral: true });
            } else if (![`текст`, `ембед`, `оба`, 1, 2, 3].includes(types)) {
                throw new TypeError(`${types} не входит в число доступных типов этой функции.`)
            }
        };
    if (inCustom === `o.but_create`) {
        inMessage.delete().catch(err => conErr(`Message/interaction/orders/button.js`, err));
        console.log(`Yas`)
        database.fetchData(`id`, `${inMember.user.id}`, `users`, usr => {
            if (usr === undefined) return conErr(`Message/interaction/orders/button.js`, `Произошла ошибка при проверке человека в БД! (0)[0]{o.but_create}`);
            if (usr === null) return conErr(`Message/interaction/orders/button.js`, `Этот пользователь не оказался в БД! (1)[0]{o.but_create}`), inReply(1, `Тебя  нет в БД!`);
            if (usr?.name_clan != `null`) val.a = true;
            if (usr?.type_clan != `null`) val.b = true;
            if (new Number(inMember.user.displayColor) == 0) { colors = parseInt(`48dfbf`, 16) } else if (new Number(inMember.user.displayColor) != 0) { colors = inMember.user.displayColor; }
            if (usr?.name_clan != `null` && usr?.type_clan != `null`) {
                inReply(2, {
                    title: `${usr?.type_clan} ${usr?.name_clan}`,
                    description: `Ваше положение: ${usr?.positions}`,
                    color: colors,
                });
            } else {
        type.reply({
            embeds: [{ 
                title: `Создание "Гильдии"`, 
                description: `Выберите тип "клана" и её название с помощью кнопок ниже.`, 
                color: parseInt(`25ff00`, 16) 
            }], 
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    custom_id: `o.but_menu_type`,
                    style: 1,
                    label: `Выбор типа "гильдии"`,
                    disabled: val.a,
                }, {
                    type: 2,
                    custom_id: `o.but_modal_name`,
                    style: 1,
                    label: `Введите имя "гильдии"`,
                    disabled: val.b,
                }],
            }],
            ephemeral: true,
        });
        }
    });
    }
    if (inCustom === `o.but_menu_type`) {
        database.fetchData(`id`, `${inMember.user.id}`, `users`, usr => {
            if (usr === undefined) return conErr(`Message/interaction/orders/button.js`, `Произошла ошибка при проверку наличия человека в БД! (0)[1]{o.but_menu_type}`);
            if (usr === null) return conErr(`Message/interaction/orders/button.js`, `Человека не оказалось в БД! (1)[1] {o.but_menu_type}`), inReply(1, `Тебя  нет в БД!`);
            if (usr?.type_clan != `null`) {
        inReply(3, {
            embeds: [{
                title: `Выбор типа`,
                description: `Выберите нужный вам тип "гильдии" в меню ниже`,
                color: parseInt(`25ff00`, 16)
            }],
            components: [{
                type: 1,
                components: [{
                    custom_id: `o.menu_type`,
                    placeholder: `Выбор типа "гильдии"`,
                    min_values: 1,
                    max_values: 1,
                    options: [{
                        label: `Культ`,
                        description: `Преклонение перед кем-нибудь или чем-нибудь.`,
                        value: `o.m_type_a`,
                    }, {
                        label: `Орден`,
                        description: `Организация, сообщество лиц, связанных общей целью и особыми правилами жизни.`,
                        value: `o.m_type_b`,
                    }, {
                        label: `Секта`,
                        description: `Группа лиц, замкнувшихся в своих мелких, узких интересах.`,
                        value: `o.m_type_c`,
                    }, {
                        label: `Клан`,
                        description: `Групировка связанная тесными отношениями.`,
                        value: `o.m_type_d`,
                    }],
                }],
            }],
        });
        } else {
            return inReply(2, { 
                title: `Тип "клана"`, 
                description: `Ваш тип "клана": ${usr?.type_clan}`, 
                color: parseInt(`25ff00`, 16) 
            });
        }
    });
    }
    if (inCustom === `o.but_modal_name`) {
        database.fetchData(`id`, `${inMember.user.id}`, `users`, usr => {
            if (usr === undefined) return conErr(`Message/interaction/orders/button.js`, `При проверке на наличие юзера в БД произошла ошибка! (0)[2]{o.but_modal_name}`);
            if (usr === null) return conErr(`Message/interaction/orders/button.js`, `Человека не оказалось в БД! (1)[1] {o.but_modal_name}`), inReply(1, `Тебя нет в БД!`);
            if (usr?.clan_name == `null`) {
        inModal({
            title: `Напишите название для вашей "гильдии"`,
            custom_id: `o.modal_name`,
            components: [{
                type: 1,
                components: [{
                    type: 4,
                    custom_id: `o.m.val_name`,
                    label: `Название`,
                    style: 1,
                    min_length: 3,
                    max_length: 25,
                    placeholder: `Не больше 25`,
                    required: true,
                }],
            }],
        });
    } else {
        let colors;
        if (new Number(inMember.user.displayColor) == 0) { colors = parseInt(`48dfbf`, 16) } else if (new Number(inMember.user.displayColor) != 0) { colors = inMember.user.displayColor; }
        let nn = usr?.type_clan;
        let tt = usr?.positions;
        if (nn == `null`) nn = `"Гильдия"`;
        if (tt == `null`) tt = `Осталось выбрать тип данных`;
        if (tt != `null`) tt = `Ваша позиция в клане: ${tt}`;
        inReply(2, { 
            title: `${nn} ${usr.name_clan}`, 
            description: `${tt}`,
            color: colors,
         });
    }
    });
    }
    }
}

exports.isButton = new isButton();