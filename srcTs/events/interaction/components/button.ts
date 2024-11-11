import type { EmiliaClient } from "@client";
import { Log } from "@log";
import { isModal, isReply } from "@util/s";
import { type APIEmbed, type AnyComponent, type ButtonInteraction, GuildMember, TextChannel } from "discord.js";

class ButtonComponent {
  constructor(interaction: ButtonInteraction, client: EmiliaClient) {
    this.build(interaction, client).catch((e) => { console.error(e); });
  }

  /**
   * @param interaction
   * @param client
   */
  private async build(interaction: ButtonInteraction, client: EmiliaClient) {
    const inCustom = interaction.customId;
    const inMember = interaction.member;
    //const inUser = interaction.user;
    const inGuild = interaction.guild;
    const inMessage = interaction.message;
    //const inChannel = interaction.channel;
    const inChannelCache = inGuild?.channels.cache;
    //const inCrePers = new cre_pers();
    if (inCustom === "but_test") {
      console.log(interaction.message.components);
      await interaction.reply({ content: "Тут ничего нет", ephemeral: true });
    }

    if (!inMember || !(inMember instanceof GuildMember)) return;

    const isChannel = (channel: unknown): channel is TextChannel => channel instanceof TextChannel;
    //let blood = () => inCrePers.blood(Math.round(Math.random() * 100));

    if (inCustom === "but_embed") {
      const embeds: APIEmbed[] = interaction.message.embeds.map((i) => (i.data));
      console.log(embeds);
      embeds[0].footer = { text: "text " };
      console.log(embeds);
      await interaction.message.edit({ embeds });
    }

    if (inCustom === "role.but_churka") {
      if (inMember.roles.cache.has("1088055370037067786")) {
        inMember.roles.remove("1088055370037067786");
        isReply({ interaction, message: { content: "Теперь ты не Чурка" } });
      } else {
        inMember.roles.add("1088055370037067786");
        isReply({ interaction, message: { content: "Теперь ты Чурка" } });
      }
    }

    if (inCustom === "but_modal") {
      const modal = {
        title: "My Modal",
        custom_id: "modal_custom", //или customId попробуешь
        components: [{
          type: 1,
          components: [{
            type: 4,
            custom_id: "modal_value_custom", // ↑
            label: "Oh my...",
            style: 1,
            min_length: 1,
            max_length: 20,
            placeholder: "текст в поле ввода",
            required: true, //обязательное ли поле
          }],
        }],
      };
      isModal({ interaction, modal });
    }

    if (inCustom === "but_test") {
      const nn: AnyComponent = interaction.message.components[0].components[0].data;

      nn.disabled = true;
      interaction.message.edit({ components: [interaction.message.components[0]] });
      interaction.reply({ content: "Готово", ephemeral: true });
      console.log("Удачно");
    }

    if (inCustom === "bruh_test") {
      isModal({
        interaction,
        modal: {
          custom_id: "bruh_mod_test",
          title: "Модальное окно",
          components: [{
            type: 1,
            components: [{
              type: 4,
              label: "Как видишь - это модальное окно",
              style: 1,
              placeholder: "А сюда вводится текст",
              custom_id: "val_t_bruh",
              min_length: 1,
              max_length: 30,
              required: true,
            }],
          }],
        }
      });
    }

    if (inCustom === "but_chtech") {
      if (inMember.roles.cache.find(r => r.id === "941732063852245002")) {
        inMember.roles.remove("941732063852245002");
        interaction.reply({ content: "Вы сняли роль Чтец.", ephemeral: true });
      } else if (!inMember.roles.cache.find(r => r.id === "941732063852245002")) {
        inMember.roles.add("941732063852245002");
        interaction.reply({ content: "Вы взяли роль Чтец и будете ловить пинги в лицо время от времени в <#881532304311332884> по ранобе.", ephemeral: true });
      }
    }

    if (inCustom === "but_g_name") {
      isModal({
        interaction, modal: {
          custom_id: "mod_g_name",
          title: "Имя персонажа",
          components: [{
            type: 1,
            components: [{
              type: 4,
              label: "Введите имя для персонажа",
              style: 1,
              placeholder: "Имя персонажа",
              custom_id: "val_g_name",
              min_length: 3,
              max_length: 30,
              required: true,
            }],
          }],
        }
      });
    }

    if (inCustom === "but_g_race") {
      isModal({
        interaction,
        modal: {
          custom_id: "mod_g_race",
          title: "Раса персонажа",
          components: [{
            type: 1,
            components: [{
              type: 4,
              label: "Введите расу персонажа",
              style: 1,
              placeholder: "Раса персонажа",
              custom_id: "val_g_race",
              min_length: 1,
              max_length: 15, //позже изменю, если будет больше
              required: true,
            }],
          }],
        }
      });
    }

    if (inCustom === "but_g_obr") {
      isModal({
        interaction,
        modal: {
          custom_id: "mod_g_obr",
          title: "Обращение к игроку",
          components: [{
            type: 1,
            components: [{
              type: 4,
              label: "Как к вам обращаться?",
              placeholder: "Если вам лень, то введи: скип",
              style: 1,
              custom_id: "val_g_obr",
              min_length: 4,
              max_length: 10,
              required: true,
            }],
          }],
        }
      });
    }

    if (inCustom === "but_g_pol") {
      isModal({
        interaction,
        modal: {
          custom_id: "mod_g_pol",
          title: "Пол персонажа",
          components: [{
            type: 1,
            components: [{
              type: 4,
              label: "Какой пол у вашего персонажа?",
              placeholder: "Есть только Мужской или Женский",
              style: 1,
              custom_id: "val_g_pol",
              min_length: 7,
              max_length: 7,
              required: true,
            }],
          }],
        }
      });
    }

    if (inCustom === "bruh_but") {
      const modal = {
        custom_id: "bruh_modal",
        title: "Bruh Modal Open",
        components: [{
          type: 1,
          components: [{
            type: 4,
            label: "Текст",
            style: 1,
            custom_id: "bruh_text",
            min_length: 1,
            max_length: 20,
            required: true,
          }],
        }]
      };
      isModal({ interaction, modal });
    }

    if (inCustom === "but_test") {
      //interaction.edit({components: [interaction.message.components[0].setDisabled(true)]})
      //const gg = interaction.message.components[0].components[0].disabled = true;
      //console.log(trows)
      const component: AnyComponent = interaction.message.components[0].components[0].data;
      component.disabled = true;
      //const gg = interaction.message.components[0].components[0].disabled = true
      console.log(inMember.user.id);
      interaction.message.edit({ components: [interaction.message.components[0]] });
    }

    if (inCustom === "but_yess") {
      // TODO: Вспомнить шо это должно было быть
      isReply({ interaction, message: { content: "Эта кнопка пока ничего не делает" } });
      /*database.fetchData(`id`, `${inUser.id}`, `register`, ureg => {
        if (ureg === undefined) return console.log(`Краш первой строки. yass`);
        if (ureg === null) return console.log(`Что-то прошло не так на второй строке. yass`);
        database.updatePartialData(inUser.id, { perms: `Игрок` }, `register`, rg => {
          if (rg === undefined) return console.log(`Краш третьей строки. Yass`);
          if (typeof rg != `object`) return console.log(`Что-то пошло не так на четвертной строке. Yass`);
          interaction.message.edit({ content: `Спасибо. Теперь вы игрок.`, embeds: [], components: [] })
        });
      });*/
    }

    if (inCustom === "but_chat") {
      if (!inChannelCache) return;
      if (!inMember.roles.cache.find(r => r.id === "926765715745300481")) {
        const channel = inChannelCache.find(c => c.id === "926759862069788672");

        if (!isChannel(channel)) return;

        channel.permissionOverwrites.edit(inMember.id, { ViewChannel: false });
        inMember.roles.add("926765715745300481");
        interaction.reply({ content: "Общий чат был отключен.", ephemeral: true });
      } else if (inMember.roles.cache.find(r => r.id === "926765715745300481")) {
        const channel = inChannelCache.find(c => c.id === "926759862069788672");

        if (!isChannel(channel)) return;

        channel.permissionOverwrites.edit(inMember.id, { ViewChannel: true });
        inMember.roles.remove("926765715745300481");
        interaction.reply({ content: "<#926759862069788672> включён.", ephemeral: true });
      }
    }

    if (inCustom === "but_psyho") {
      if (!inChannelCache) return;

      if (!inMember.roles.cache.find(r => r.id === "926766180713250876")) {
        const channel = inChannelCache.find(c => c.id === "809884160227147866");

        if (!isChannel(channel)) return;

        channel.permissionOverwrites.edit(inMember.id, { ViewChannel: false });
        inMember.roles.add("926766180713250876");
        interaction.reply({ content: "Психушка [Чат] был отключен.", ephemeral: true });
      } else if (inMember.roles.cache.find(r => r.id === "926766180713250876")) {
        const channel = inChannelCache.find(c => c.id === "809884160227147866");

        if (!isChannel(channel)) return;
        channel.permissionOverwrites.edit(inMember.id, { ViewChannel: true });
        inMember.roles.remove("926766180713250876");
        interaction.reply({ content: "<#809884160227147866> был включён.", ephemeral: true });
      }
    }

    if (inCustom === "but_GG") {
      interaction.message.edit("GG");
    }

    if (inCustom === "but_polit") {
      if (!inChannelCache) return;

      if (!inMember.roles.cache.find(r => r.id === "818943445666103327")) {
        const channel = inChannelCache.find(c => c.id === "994934005948497980");

        if (!isChannel(channel)) return;

        channel.permissionOverwrites.edit(inMember.id, { ViewChannel: true });
        inMember.roles.add("818943445666103327");
        isReply({ interaction, message: { content: "Вы включили канал <#994934005948497980>" } });
      } else if (inMember.roles.cache?.find(r => r.id === "818943445666103327")) {
        const channel = inChannelCache.find(c => c.id === "994934005948497980");

        if (!isChannel(channel)) return;

        channel.permissionOverwrites.delete(inMember.id);
        inMember.roles.remove("818943445666103327");
        isReply({ interaction, message: { content: `Вы выключили канал ${inGuild.channels.cache?.find(c => c.id === "994934005948497980")?.name}` } });
      }
    }

    if (inCustom === "but_verif") {
      isModal({
        interaction,
        modal: {
          custom_id: "mod_verif",
          title: "Модальное окно",
          components: [{
            type: 1,
            components: [{
              type: 4,
              label: "Сюда можно ввести сообщение",
              style: 1,
              placeholder: "Сообщение.",
              custom_id: "mod_val_vefir",
              min_length: 1,
              max_length: 4000,
              required: true,
            }],
          }]
        }
      });
    }

    if (inCustom === "but_reg") {
      if (inMessage !== null || inMessage !== undefined) {
        await inMessage.delete().catch(err => new Log({ text: err, type: 2, categories: ["global", "button"] }));
      }
      // TODO: РЕГИСТРАЦИЯ
      interaction.reply({ content: "В данный момент не реализовано", ephemeral: true });
      /*database.fetchData(`id`, `${inMember.user.id}`, `register`, async (uReg) => {
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
            description: `Вы не можете зарегистрировать второго персонажа на тот-же аккаунт!`,
            color: parseInt(`ff0025`, 16)
          });//Ответ
        }
      });*/
    }

    if (inCustom === "but_g_cre_pers") {
      if (inMessage !== null || inMessage !== undefined) {
        inMessage.delete().catch(err => new Log({ text: err, type: 2, categories: ["global", "button"] }));
      }
      // TODO: СОЗДАНИЕ ПЕРСОНАЖА
      interaction.reply({ content: "В данный момент не реализовано", ephemeral: true });
      /*database.fetchData(`id`, `${inMember.user.id}`, `register`, async (cReg) => {
        if (cReg === undefined) return conErr(`BUTTON`, `Создание персонажа. Краш. 2`);
        if (cReg === null || ![`Игрок`, `Модератор`, `Администратор`, `Бета-Тестер`].includes(cReg?.perms)) return await inReply(2, {
          title: `Создание персонажа`,
          description: `Вы не имеете нужных прав или - вы не зарегистрировались.`,
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
      */
    }

    if (inCustom === "but_g_pers_name") {
      // TODO: Игровой профиль
      interaction.reply({ content: "Пока не реализовано", ephemeral: true });
      /*database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, async (name) => {
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
      */
    }

    if (inCustom === "but_g_pers_pol") {
      // TODO: Игровой профиль (пол)
      interaction.reply({ content: "Пока не реализовано", ephemeral: true });
      /*database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, async (gpol) => {
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
      */
    }

    if (inCustom === "but_g_pers_race") {
      // TODO: Игровой профиль (раса)
      interaction.reply({ content: "Пока не реализовано", ephemeral: true });
      /*database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, async (grase) => {
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
        const rChar = {
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
      */
    }

    if (inCustom === "but_g_pers_age") {
      // TODO: Игровой возраст
      interaction.reply({ content: "Ещё не реализовано", ephemeral: true });
      /*database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, async (age) => {
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
      */
    }

    if (inCustom === "but_g_pers_obr") {
      // TODO: Игровое обращение
      interaction.reply({ content: "Ещё не реализовано", ephemeral: true });
      /*database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, async (obr) => {
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
            }*\/
          );//Ответ
        }
      });//БД профиля
      */
    }

    if (["bug_g_pers_pol_a", "bug_g_pers_pol_b"].includes(inCustom)) {
      // TODO: Смена игрового пола (?)
      interaction.reply({ content: "Ещё не реализовано", ephemeral: true });
      /*database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, async (pol) => {
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
      */
    }

    if (["but_g_pers_obr_a", "but_g_pers_obr_b", "but_g_pers_obr_c"].includes(inCustom)) {
      // TODO: Выбор расы (?)
      interaction.reply({ content: "Ещё не реализовано", ephemeral: true });
      /*database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, async (obr) => {
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
              return conErr(1, `Создание персонажа | Обращение. Краш 3`);
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
      */
    }

    if (inCustom === "but_tst_test") {
      const { description } = interaction.message.embeds[0].data;
      isReply({ interaction, message: { embeds: [interaction.message.embeds[0].data] } });
      console.log(description?.trim().split(/ +/g).filter(f => f.startsWith("<@") && f.endsWith(">"))[0].slice(2, -1));
    }

    if (inCustom === "modal-test-modal") {
      await interaction.reply({ content: "Ничего нет", ephemeral: true });
    }

    if (inCustom === "but_tests") {
      isModal({
        interaction,
        modal: {
          title: "Test",
          custom_id: "mod_test",
          components: [{
            type: 1,
            components: [{
              type: 4,
              label: "Test",
              custom_id: "mod_val_test",
              style: 1,
              required: true
            }]
          }]
        }
      });
    }
  }
}

export { ButtonComponent };
