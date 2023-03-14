const Discord = require(`discord.js`);
const { conErr } = require(`../../../config.js`);
const { cre_pers } = require(`../../../Files/config.js`).chan_config.game;
class isButton {
  constructor(type, emilia) {
    this.type = type;
    this.emilia = emilia;
  }
  async on(type, emilia) {
    const inCustom = type.customId;
    const inMember = type.member;
    const inUser = type.user;
    const inGuild = type.guild;
    const inMessage = type.message;
    const inChannel = type.channel;
    const inCrePers = new cre_pers();
    let blood = () => inCrePers.blood(Math.round(Math.random() * 100));
    const inModal = (modals) => {
      return type.showModal(modals);
    };
    class inReplys extends isButton {
      constructor(types, text, comp) {
        super(type);
        this.types = types;
        this.text = text;
        this.comp = comp;
        types ??= 1;
        comp ??= undefined;
      }
      on(types, text, comp) {
        if (types == 1) {
          return type.reply({ content: `${text}`, ephemeral: true });
        } else if (types == 2) {
          return type.reply({ embeds: [text], ephemeral: true });
        } else if (types == 3) {
          return type.reply({ text, ephemeral: true })
        } else if (types == 4) {
          return type.reply({ embeds: [text], components: [comp], ephemeral: true });
        } else if (types == 5) {
          return type.reply({ text, components: [comp], ephemeral: true });
        } else if (![1, 2, 3, 4, 5].includes(types)) {
          throw new TypeError(`${types} не входит в число доступных типов этой функции.`)
        }
      }
    };
    const inReply = (num, txt, comp) => {
      return new inReplys().on(num, txt, comp)
    };
    if (inCustom == `but_modal`) {
      const modal = {
        title: `My Modal`,
        customId: `modal_custom`, //или customId попробуешь
        components: [{
          type: 1,
          components: [{
            type: 4,
            custom_id: `modal_value_custom`, // ↑
            label: `Oh my...`,
            style: 1,
            min_length: 1,
            max_length: 20,
            placeholder: `текст в поле ввода`,
            required: true, //это нужно
          }],
        }],
      };
      inModal(modal);
    }
    if (inCustom === `but_test`) {
      const nn = type.message.components[0].components[0].data;
      nn.disabled = true;
      type.message.edit({ components: [type.message.components[0]] });
      type.reply({ content: `Готово`, ephemeral: true })
      console.log(`Удачно`)
    }
    if (inCustom === `bruh_test`) {
      inModal({
        customId: `bruh_mod_test`,
        title: `Модальное окно`,
        components: [{
          type: 1,
          components: [{
            type: 4,
            label: `Как видишь - это модальное окно`,
            style: `SHORT`,
            placeholder: `А сюда вводится текст`,
            customId: `val_t_bruh`,
            minLength: 1,
            maxLength: 30,
            required: true,
          }],
        }],
      });
    }
    if (inCustom === `but_chtech`) {
      if (inMember.roles.cache.find(r => r.id === `941732063852245002`)) {
        inMember.roles.remove(`941732063852245002`);
        type.reply({ content: `Вы сняли роль Чтец.`, ephemeral: true });
      } else if (!inMember.roles.cache.find(r => r.id === `941732063852245002`)) {
        inMember.roles.add(`941732063852245002`)
        type.reply({ content: `Вы взяли роль Чтец и будете ловить пинги в лицов время от времени в <#881532304311332884> по ранобе.`, ephemeral: true });
      }
    }
    if (inCustom === `but_g_name`) {
      inModal({
        customId: `mod_g_name`,
        title: `Имя персонажа`,
        сomponents: [{
          type: 1,
          components: [{
            type: 4,
            label: `Введите имя для персонажа`,
            style: `SHORT`,
            placeholder: `Имя персонажа`,
            customId: `val_g_name`,
            minLength: 3,
            maxLength: 30,
            required: true,
          }],
        }],
      });
    }
    if (inCustom === `but_g_race`) {
      inModal({
        customId: `mod_g_race`,
        title: `Раса персонажа`,
        components: [{
          type: 1,
          components: [{
            type: 4,
            label: `Введите расу персонажа`,
            style: `SHORT`,
            placeholder: `Раса персонажа`,
            customId: `val_g_race`,
            minLength: 1,
            maxLength: 15, //позже изменю, если будет больше
            required: true,
          }],
        }],
      });
    }
    if (inCustom === `but_g_obr`) {
      inModal({
        customId: `mod_g_obr`,
        title: `Обращение к игроку`,
        components: [{
          type: 1,
          components: [{
            type: 4,
            label: `Как к вам обращаться?`,
            placeholder: `Если вам лень, то введи: скип`,
            style: `SHORT`,
            customId: `val_g_obr`,
            minLength: 4,
            maxLength: 10,
            required: true,
          }],
        }],
      });
    }
    if (inCustom === `but_g_pol`) {
      inModal({
        customId: `mod_g_pol`,
        title: `Пол персонажа`,
        components: [{
          type: 1,
          components: [{
            type: 4,
            label: `Какой пол у вашего персонажа?`,
            placeholder: `Есть только Мужской или Женский`,
            style: `SHORT`,
            customId: `val_g_pol`,
            minLength: 7,
            maxLength: 7,
            required: true,
          }],
        }],
      });
    }
    if (inCustom === `bruh_but`) {
      const modal = {
        customId: `bruh_modal`,
        title: `Bruh Modal Open`,
        components: [{
          type: 1,
          components: [{
            type: 4,
            label: `Текст`,
            style: `SHORT`,
            customId: `bruh_text`,
            minLength: 1,
            maxLength: 20,
            required: true,
          }],
        }]
      }
      inModal(modal)
    }
    if (inCustom === `but_test`) {
      //type.edit({components: [type.message.components[0].setDisabled(true)]})
      //const gg = type.message.components[0].components[0].disabled = true;
      //console.log(trows)
      type.message.components[0].components[0].data.disabled = true
      //const gg = type.message.components[0].components[0].disabled = true
      console.log(inMember.user.id)
      type.message.edit({ components: [type.message.components[0]] })
    }
    if (inCustom === `but_yess`) {
      database.fetchData(`id`, `${inUser.id}`, `register`, ureg => {
        if (ureg === undefined) return console.log(`Краш первой строки. yass`);
        if (ureg === null) return console.log(`Что-то прошло не так на второй строке. yass`);
        database.updatePartialData(inUser.id, { perms: `Игрок` }, `register`, rg => {
          if (rg === undefined) return console.log(`Краш третьей строки. Yass`);
          if (typeof rg != `object`) return console.log(`Что-то пошло не так на четвертной строке. Yass`);
          type.message.edit({ content: `Спасибо. Теперь вы игрок.`, embeds: [], components: [] })
        });
      });
    }
    if (inCustom === `but_chat`) {
      if (!inMember.roles.cache.find(r => r.id === `926765715745300481`)) {
        inGuild.channels.cache.find(c => c.id === `926759862069788672`).permissionOverwrites.edit(inMember.id, { ViewChannel: false });
        inMember.roles.add(`926765715745300481`);
        type.reply({ content: `Общий чат был отключен.`, ephemeral: true });
      } else if (inMember.roles.cache.find(r => r.id === `926765715745300481`)) {
        inGuild.channels.cache.find(c => c.id === `926759862069788672`).permissionOverwrites.edit(inMember.id, { ViewChannel: true });
        inMember.roles.remove(`926765715745300481`);
        type.reply({ content: `<#926759862069788672> включён.`, ephemeral: true });
      }
    } else if (inCustom === `but_psyho`) {
      if (!inMember.roles.cache.find(r => r.id === `926766180713250876`)) {
        inGuild.channels.cache.find(c => c.id === `809884160227147866`).permissionOverwrites.edit(inMember.id, { ViewChannel: false });
        inMember.roles.add(`926766180713250876`);
        type.reply({ content: `Психушка [Чат] был отключен.`, ephemeral: true });
      } else if (inMember.roles.cache.find(r => r.id === `926766180713250876`)) {
        inGuild.channels.cache.find(c => c.id === `809884160227147866`).permissionOverwrites.edit(inMember.id, { ViewChannel: true });
        inMember.roles.remove(`926766180713250876`);
        type.reply({ content: `<#809884160227147866> был включён.`, ephemeral: true });
      }
    }
    if (inCustom === `but_GG`) {
      type.message.edit(`GG`);
    }
    if (inCustom === `but_polit`) {
      if (!inMember.roles.cache.find(r => r.id === `818943445666103327`)) {
        inGuild.channels.cache.find(c => c.id === `994934005948497980`).permissionOverwrites.edit(inMember.id, { ViewChannel: true })
        inMember.roles.add(`818943445666103327`);
        inReply(1, `Вы включили канал <#994934005948497980>`)
      } else if (inMember.roles.cache?.find(r => r.id === `818943445666103327`)) {
        inGuild.channels.cache.find(c => c.id === `994934005948497980`).permissionOverwrites.delete(inMember.id)
        inMember.roles.remove(`818943445666103327`);
        inReply(1, `Вы выключили канал ${inGuild.channels.cache?.find(c => c.id === `994934005948497980`)?.name}`)
      }
    }
    if (inCustom === `but_verif`) {
      inModal({
        customId: `mod_verif`,
        title: `Модальное окно`,
        components: [{
          type: 1,
          components: [{
            type: 4,
            label: `Сюда можно ввести сообщение`,
            style: `SHORT`,
            placeholder: `Сообщение.`,
            customId: `mod_val_vefir`,
            minLength: 1,
            maxLength: 4000,
            required: true,
          }],
        }]
      })
    }
    if (inCustom === `but_reg`) {
      if (inMessage != null || inMessage != undefined) {
        await inMessage.delete().catch(err => conErr(inCustom, err));
      }
      database.fetchData(`id`, `${inMember.user.id}`, `register`, async (uReg) => {
        if (uReg === undefined) return conErr(`BUTTON`, `Регистрация. 1`);
        if (uReg === null) {
          inModal({
            customId: `mod_g_reg`,
            title: `Регистрация`,
            components: [{
              type: 1,
              components: [{
                type: 4,
                label: `Введите код - для завершения регистрации`,
                style: `SHORT`,
                placeholder: `${ran}`,
                customId: `${ran}`,
                minLength: 4,
                maxLength: 4,
                required: true,
              }],
            }],
          });
        } else {
          await inReply(2, {
            title: `Регистрация`,
            description: `Вы не можете зарегестрировать второго персонажа на тот-же аккаунт!`,
            color: parseInt(`ff0025`, 16)
          });//Ответ
        }
      });
    }
    if (inCustom === `but_g_cre_pers`) {
      if (inMessage != null || inMessage != undefined) {
        inMessage.delete().catch(err => conErr(inCustom, err));
      }
      database.fetchData(`id`, `${inMember.user.id}`, `register`, async (cReg) => {
        if (cReg === undefined) return conErr(`BUTTON`, `Создание персонажа. Краш. 2`);
        if (cReg === null || ![`Игрок`, `Модератор`, `Администратор`, `Бета-Тестер`].includes(cReg?.perms)) return await inReply(2, {
          title: `Создание персонажа`,
          description: `Вы не имеете нужных прав или - вы не зарегестрировались.`,
          color: parseInt(`ff2500`, 16),
        });//Ответ
        if ([`Игрок`, `Модератор`, `Администратор`, `Бета-Тестер`].includes(cReg?.perms)) {
          database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, async (cGam) => {
            if (cGam === undefined) return conErr(`BUTTON`, `Создание персонажа. Краш. 3`);
            if (cGam === null) return inReply(2, {
              title: `Создание персонажа`,
              description: `Похоже вас не записало в Базу Данных. Обратитесь к администрации бота.`,
              color: parseInt(`ff2500`, 16),
            });//Ответ
            if (cGam?.имя_персонажа.length < 3 || cGam?.возраст_персонажа.length < 2 || cGam?.пол_игрока.length < 4 || cGam?.раса_игрока.length < 3 || cGam?.обращение.length < 3) {
              await inReply(4, {
                title: `Создание персонажа`,
                description: `**Имя**: ${cGam?.имя_персонажа || `Нет данных`}\n**Возраст**: ${cGam?.возраст_персонажа >= 14 ? cGam?.возраст_персонажа : `Нет данных`}\n**Пол**: ${cGam?.пол_игрока || `Нет данных`}\n**Раса**: ${cGam?.раса_игрока || `Нет данных`}\n**Родословная**: ${cGam?.родословная || `Будет введено само.`}`,
                color: parseInt(`25ff00`, 16),
                footer: {
                  text: `Обращение: ${cGam?.обращение || `Нет данных`}`
                }
              }, {
                components: [{
                  custom_id: `but_g_pers_name`,
                  label: `Имя персонажа`,
                  disabled: cGam?.имя_персонажа.length >= 3,
                  style: 3,
                  type: 2
                }, {
                  custom_id: `but_g_pers_pol`,
                  label: `Пол персонажа`,
                  disabled: cGam?.пол_игрока.length >= 3,
                  style: 3,
                  type: 2
                }, {
                  custom_id: `but_g_pers_race`,
                  label: `Раса персонажа`,
                  disabled: cGam?.раса_игрока.length >= 3,
                  style: 3,
                  type: 2
                }, {
                  custom_id: `but_g_pers_age`,
                  label: `Возраст персонажа`,
                  disabled: cGam?.возраст_персонажа >= 14,
                  style: 3,
                  type: 2
                }, {
                  custom_id: `but_g_pers_obr`,
                  label: `Обращение в сообщениях (к игроку)`,
                  disabled: cGam?.обращение.length >= 3,
                  style: 3,
                  type: 2
                }],
                type: 1
              });//Ответ
            } else {
              return await inReply(2, {
                title: `Создание персонажа`,
                description: `**Имя**: ${cGam?.имя_персонажа || `Нет данных`}\n**Возраст**: ${cGam?.возраст_персонажа || `Нет данных`}\n**Пол**: ${cGam?.пол_игрока || `Нет данных`}\n**Раса**: ${cGam?.раса_игрока || `Нет данных`}\n**Родословная**: ${cGam?.родословная || `Будет введено само.`}`,
                color: parseInt(`25ff00`, 16),
                footer: {
                  text: `Обращение: ${cGam?.обращение || `Нет данных`} || Ваш персонаж полностью создан. Вы ничего нового не увидите.`
                }
              });//Ответ
            }
          });//БД профиля
        }
      });//БД регистрации
    }
    if (inCustom === `but_g_pers_name`) {
      database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, async (name) => {
        if (name === undefined) {
          return conErr(`BUTTON`, `Создание персонажа | Имя. Краш 1.`);
        }
        if (name === null) {
          return await inReply(2, {
            title: `Создание персонажа`,
            description: `Похоже вас не записало в Базу Данных. Обратитесь к администрации бота.`,
            color: parseInt(`ff2500`, 16),
          });//ответ
        }
        if (name?.имя_персонажа.length >= 3) {
          return await inReply(2, {
            title: `Создание персонажа`,
            description: `Имя: ${name?.имя_персонажа}`,
            color: parseInt(`25ff00`, 16),
            footer: {
              text: `Ваш персонаж имеет Имя. Повторно оно не меняется.`
            }
          });//Ответ
        }
        if (name?.имя_персонажа.length <= 3) {
          inModal({
            customId: `mod_g_pers_name`,
            title: `Создание персонажа`,
            components: [{
              type: 1,
              components: [{
                type: 4,
                label: `Придумайте имя для своего персонажа`,
                style: `SHORT`,
                customId: `val_g_name`,
                placeholder: `Имя персонажа`,
                minLength: 3,
                maxLength: 28,
                required: true,
              }],
            }],
          });//Модальное
        }
      });//БД профиля
    }
    if (inCustom === `but_g_pers_pol`) {
      database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, async (gpol) => {
        if (gpol === undefined) {
          return conErr(`BUTTON`, `Создание персонажа | Пол. Краш 1`);
        }
        if (gpol === null) {
          return await inReply(2, {
            title: `Создание персонажа`,
            description: `Похоже вас не записало в Базу Данных. Обратитесь к администрации бота.`,
            color: parseInt(`ff2500`, 16),
          });//ответ
        }
        if (gpol != null) {
          if (gpol?.пол_игрока.length <= 4) {
            await inReply(4, {
              title: `Создание персонажа`,
              description: `Выбор пола для вашего персонажа. Пока есть ток 2 пола: Мужской и Женский`,
              color: parseInt(`25ff00`, 16),
            }, {
              components: [{
                custom_id: `bug_g_pers_pol_a`,
                label: `Мужской`,
                style: 3,
                type: 2
              }, {
                custom_id: `bug_g_pers_pol_b`,
                label: `Женский`,
                style: 3,
                type: 2
              }],
              type: 1
            });
          } else {
            return await inReply(2, {
              title: `Создание персонажа`,
              description: `Пол персонажа: ${gpol?.пол_игрока}`,
              color: parseInt(`25ff00`, 16),
              footer: {
                text: `Вы не можете повторно выбрать пол для персонажа!`
              }
            }); //ответ
          }
        }
      });//БД профиля
    }
    if (inCustom === `but_g_pers_race`) {
      database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, async (grase) => {
        if (grase === undefined) {
          return conErr(`BUTTON`, `Создание персонажа | Раса. Краш 1`);
        }
        if (grase === null) {
          return await inReply(2, {
            title: `Создание персонажа`,
            description: `Похоже вас не записало в Базу Данных. Обратитесь к администрации бота.`,
            color: parseInt(`ff2500`, 16)
          });//Ответ
        }
        let rChar = {
          человек: inCrePers.rase_char(`человек`),
          эльф: inCrePers.rase_char(`эльф`),
          демон: inCrePers.rase_char(`демон`),
          гном: inCrePers.rase_char(`гном`),
          дварф: inCrePers.rase_char(`дварф`),
          орк: inCrePers.rase_char(`орк`),
          зверолюд: inCrePers.rase_char(`зверолюд`),
        };
        if (grase != null) {
          await inReply(4, {
            title: `Создание персонажа`,
            description: `Выберете расу персонажа`,
            color: parseInt(`25ff00`, 16),
            footer: {
              text: `Список рас может изменяться`
            }
          },
            {
              components: [{
                custom_id: `sel_g_pers_race`,
                placeholder: `Выбор расы персонажа`,
                min_values: 1,
                max_values: 1,
                options: [{
                  label: `Человек`,
                  description: `Характеристики: ловкость: ${rChar.человек?.ловкость_игрока}, сила: ${rChar.человек?.сила_игрока}, удача: ${rChar.человек?.удача_игрока}`,
                  value: `Человек`
                },
                {
                  label: `Эльф`,
                  description: `Характеристики: ловкость: ${rChar.эльф?.ловкость_игрока}, точность: ${rChar.эльф?.точность_игрока}`,
                  value: `Эльф`
                },
                {
                  label: `Демон`,
                  description: `Характеристики: сила: ${rChar.демон?.сила_игрока}, выносливость: ${rChar.демон?.выносливость_игрока}`,
                  value: `Демон`
                },
                {
                  label: `Гном`,
                  description: `Характеристики: сила: ${rChar.гном?.сила_игрока}, выносливость: ${rChar.гном?.выносливость_игрока}, ловкость: ${rChar.гном?.ловкость_игрока}`,
                  value: `Гном`
                },
                {
                  label: `Дварф`,
                  description: `Характеристики: сила: ${rChar.дварф?.сила_игрока}, выносливость: ${rChar.дварф?.выносливость_игрока}`,
                  value: `Дварф`
                },
                {
                  label: `Орк`,
                  description: `Характеристики: сила: ${rChar.орк?.сила_игрока}, выносливость: ${rChar.орк?.выносливость_игрока}`,
                  value: `Орк`
                },
                {
                  label: `Зверолюд`,
                  description: `Характеристики: сила: ${rChar.зверолюд?.сила_игрока}, ловкость: ${rChar.зверолюд?.ловкость_игрока}, выносливость: ${rChar.зверолюд?.выносливость_игрока}`,
                  value: `Зверолюд`
                },
                ],
                type: 3
              }],
              type: 1
            });//Ответ
        }
      });//БД профиля
    }
    if (inCustom === `but_g_pers_age`) {
      database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, async (age) => {
        if (age === undefined) {
          return conErr(`BUTTON`, `Создание персонажа | Возраст. Краш 1`);
        }
        if (age === null) {
          return await inReply(2, {
            title: `Создание персонажа`,
            description: `Похоже вас не записало в Базу Данных. Обратитесь к администрации бота.`,
            color: parseInt(`ff2500`, 16),
          });//ответ
        }
        if (age?.возраст_персонажа >= 14) {
          return await inReply(2, {
            title: `Создание персонажа`,
            description: `Возраст вашего персонажа: ${age?.возраст_персонажа}`,
            footer: {
              text: `Вы не можете повторно сменить возраст персонажа.`
            },
            color: parseInt(`ff2500`, 16),
          });//Ответ
        }
        if (age != null) {
          inModal({
            title: `Создание персонажа`,
            custom_id: `mod_g_pers_age`,
            components: [{
              type: 1,
              components: [{
                type: 4,
                custom_id: `val_g_pers_age`,
                label: `Возраст персонажа`,
                style: 1,
                min_length: 2,
                max_length: 4,
                placeholder: `Мин: 14. Без символов.`,
                required: true,
              }],
            }],
          });//Окно
        }
      });//БД профиля
    }
    if (inCustom === `but_g_pers_obr`) {
      database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, async (obr) => {
        if (obr === undefined) {
          return conErr(`BUTTON`, `Создание персонажа | Обращение. Краш 1`);
        }
        if (obr === null) {
          return await inReply(2, {
            title: `Создание персонажа`,
            description: `Похоже вас не записало в Базу Данных. Обратитесь к администрации бота.`,
            color: parseInt(`ff2500`, 16)
          });//Ответ
        }
        if (obr != null) {
          inReply(4, {
            title: `Создание персонажа`,
            description: `Выберете то, как к вам обращаться.`,
            footer: {
              text: `"Обращаться" - как парню, девушке или нейтрально. Можно сменить в любое время (не в этой команде).`
            },
            color: parseInt(`25ff00`, 16)
          },
            {
              components: [{
                custom_id: `but_g_pers_obr_a`,
                label: `Мужчина`,
                style: 3,
                type: 2
              },
              {
                custom_id: `but_g_pers_obr_b`,
                label: `Девушка`,
                style: 3,
                type: 2
              },
              {
                custom_id: `but_g_pers_obr_c`,
                label: `Без выбора`,
                style: 3,
                type: 2
              }],
              type: 1
            }
            /*{ components: [{
                custom_id: `sel_g_pers_obr`,
                placeholder: `Обращение к вам`,
                min_values: 1,
                max_values: 1, 
                options: [{
                  label: `Мужчина`,
                  description: `Пример: [имя] подобрал [зелье].`,
                  value: `1`,}, 
                { label: `Девушка`,
                  description: `Пример: [имя] купила [оружие].`,
                  value: `2`, },
                { label: `Без выбора`,
                  description: `Пример: [имя] победил(а) гоблина.`,
                  value: `3`,
                }], 
                type: 3
              }],
              type: 1,
            }*/
          );//Ответ
        }
      });//БД профиля
    }
    if ([`bug_g_pers_pol_a`, `bug_g_pers_pol_b`].includes(inCustom)) {
      database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, async (pol) => {
        if (pol === undefined) {
          return conErr(`BUTTON`, `Создание персонажа | Пол. Краш 1`);
        }
        if (pol === null) {
          return inReply(2, {
            title: `Создание персонажа`,
            description: `Похоже вас не записало в Базу Данных. Обратитесь к администрации бота.`,
            color: parseInt(`ff2500`)
          });
        }
        if (pol != null) {
          let pers_pol;
          if (inCustom === `bug_g_pers_pol_a`) {
            pers_pol = `мужской`;
          }
          if (inCustom === `bug_g_pers_pol_b`) {
            pers_pol = `женский`;
          }
          if (pol?.пол_игрока.length <= 5) {
            database.updatePartialData(inMember.user.id, { пол_игрока: inCrePers.pers_pol(pers_pol) }, `gameprofile`, async (upPol) => {
              if (upPol === undefined) {
                return conErr(`BUTTON`, `Создание персонажа | Пол. Краш 2`);
              }
              if (typeof upPol != `object`) {
                return conErr(`BUTTON`, `Создание персонажа | Пол. Краш 3`);
              }
              await inReply(2, {
                title: `Создание персонажа`,
                description: `Пол вашего персонажа: ${inCrePers.pers_pol(pers_pol)}`,
                color: parseInt(`25ff00`, 16),
              });
              if (pol?.родословная.length < 1) {
                database.updatePartialData(inMember.user.id, { родословная: `${blood()}` }, `gameprofile`, async (bloods) => {
                  if (bloods === undefined) {
                    return conErr(`BUTTON`, `Создание персонажа | Родословная (Пол). Краш 1`);
                  }
                  if (typeof bloods != `object`) {
                    return conErr(`BUTTON`, `Создание персонажа | Родословная (Пол). Краш 2`);
                  }
                });//Запись
              } else {
                return;
              }
            });//запись
          } else {
            return await inReply(2, {
              title: `Создание персонажа`,
              description: `Пол персонажа: ${pol?.пол_игрока}`,
              color: parseInt(`ff2500`, 16),
              footer: {
                text: `Вы не можете повторно выбрать пол для персонажа!`
              }
            });//ответ
          }
        }
      });//БД профиля
    }
    if ([`but_g_pers_obr_a`, `but_g_pers_obr_b`, `but_g_pers_obr_c`].includes(inCustom)) {
      database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, async (obr) => {
        if (obr === undefined) {
          return conErr(1, `Создание персонажа | Обращение. Краш 1`);
        }
        if (obr === null) {
          return await inReply(2, {
            title: `Создание персонажа`,
            description: `Похоже вас не записало в Базу Данных. Обратитесь к администрации бота.`,
            color: parseInt(`ff2500`, 16),
          });
        }
        if (obr != null) {
          let ob;
          if (inCustom === `but_g_pers_obr_a`) {
            ob = 1;
          }
          if (inCustom === `but_g_pers_obr_b`) {
            ob = 2;
          }
          if (inCustom === `but_g_pers_obr_c`) {
            ob = 3;
          }
          if (obr?.обращение.length >= 3) {
            return inReply(2, {
              title: `Создание персонажа`,
              description: `Ваше обращение: ${obr?.обращение}. Вы не можете (здесь) повторно выбрать обращение.`,
              color: parseInt(`ff2500`, 16)
            });
          }
          database.updatePartialData(inMember.user.id, { обращение: inCrePers.obr(ob) }, `gameprofile`, async (upObr) => {
            if (upObr === undefined) {
              return conErr(1, `Создание персонажа | Обращение. Краш 2`);
            }
            if (typeof upObr != `object`) {
              return await conErr(1, `Создание персонажа | Обращение. Краш 3`);
            }
            await inReply(2, { title: `Создание персонажа`, description: `Вы установили обращение: ${inCrePers.obr(ob)}`, color: `#25ff00` });

            if (obr?.родословная.length < 1) {
              database.updatePartialData(inMember.user.id, { родословная: `${blood()}` }, `gameprofile`, async (bloods) => {
                if (bloods === undefined) {
                  return conErr(`BUTTON`, `Создание персонажа | Родословная (Обращение). Краш 1`);
                }
                if (typeof bloods != `object`) {
                  return conErr(`BUTTON`, `Создание персонажа | Родословная (Обращение). Краш 2`);
                }
              });//Запись
            } else {
              return;
            }
          });//Запись
        }
      });//БД профиля
    }
    if (inCustom === `but_val_chan`) {
      inMessage.delete().catch(console.error);
      inReply(4, {
        title: `Включение/Выключение канала/категории`,
        description: `Выберете действие, что вы хотите сделать с каналами или категориями`,
        color: parseInt(`25ff00`, 16)
      }, {
        components: [{
          label: `Включить`,
          custom_id: `but_val_chan_on`,
          style: 3,
          type: 2,
        }, {
          label: `Выключить`,
          custom_id: `but_val_chan_off`,
          style: 4,
          type: 2,
        }],
        type: 1
      });
    }
    if (inCustom === `but_val_chan_on`) {
      inReply(1, `Пока так`);
    }
    if (inCustom === `but_val_chan_off`) {
      inReply(1, `Пока так 2`);
    }
    if (inCustom === `but_tst_test`) {
      const { description } = type.message.embeds[0].data;
      inReply(2, type.message.embeds[0].data);
      console.log(description.trim().split(/ +/g).filter(f => f.startsWith(`<@`) && f.endsWith(`>`))[0].slice(2, -1));
    }
  }
}
exports.isButtons = new isButton();