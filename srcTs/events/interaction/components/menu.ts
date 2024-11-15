import type { EmiliaClient } from "@client";
import { /*isModal,*/ isReply } from "@util/s";
import type { AnySelectMenuInteraction } from "discord.js";

export class MenuComponent {
  constructor(interaction: AnySelectMenuInteraction, client: EmiliaClient) {
    this.build(interaction, client); //.catch((e: unknown) => { console.error(e); });
  }

  /**
   * @param interaction
   * @param client
   */
  private async build(interaction: AnySelectMenuInteraction, client: EmiliaClient) {
    const inCustom = interaction.customId;
    /*const inMember = interaction.member;
    const inUser = interaction.user;
    const inGuild = interaction.guild;
    const inMessage = interaction.message;
    const inChannel = interaction.channel;*/
    const inValue = interaction.values;

    if (inCustom === "sel_test") {
      if (inValue[0] === "val_test_a" && inValue[1] === "val_test_b") {
        await interaction.update({ content: "Bruh", components: [] });
      } else if (inValue[0] === "val_test_a") {
        await interaction.update({ content: "Уже пусто.", components: [] });
      } else if (inValue[0] === "val_test_b") {
        await interaction.update({ content: "Baka.", components: [] });
      }
    }

    if (inCustom === "sel_chan_var") {
      if (inValue[0] === "val_chan_on") {
        interaction.reply({ content: "Yas", ephemeral: true });
      } else if (inValue[0] === "val_chan_off") {
        interaction.reply({ content: "No", ephemeral: true });
      }
    }

    if (inCustom === "sel_chan") {
      // TODO: Вспомнить что оно должно делать
      isReply({ interaction, message: { content: "Я не помню, что тут было. Будет реализовано позже", ephemeral: true } });
      /*
      if (inValue[0] === "val_chan_2") {
        const inMenu: StringSelectMenuComponent[] = inMessage.components[0].components as unknown as StringSelectMenuComponent[];
        console.log(inMenu.filter(f => f?.value !== inValue[0]));
        inMenu[0].options = inComponent.mesComponent(0, 0).options.filter(f => f.value != inValue[0]).map(i => i);
        inMessage.edit({ content: `gg`, components: [inComponent.message(0)] });
        console.log("val_chan_2");
      }
      if (inValue[0] === "val_chan_3") {
        console.log("Вот");
      }*/
    }

    if (inCustom === "sel_g_pers_pol") {
      // TODO: Выбор пола персонажа
      isReply({ interaction, message: { content: "Будет реализовано позже", ephemeral: true } });
      /*
      const pols = (a) => inCrePers.pers_pol(a);
      const blood = () => inCrePers.blood(Math.round(Math.random() * 100));
      database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, async (sPol) => {
        if (sPol === undefined) {
          return conErr(`SELECT_MENU`, `Создание персонажа | Пол. Краш 2`);
        }
        if (sPol === null) {
          return await inReply(2, {
            title: `Создание персонажа`,
            description: `Похоже вас не записало в Базу Данных. Обратитесь к администрации бота.`,
            color: Number.parseInt(`ff2500`, 16)
          }
          );
        }
        if (sPol != null) {
          if (sPol?.пол_игрока.length <= 6) {
            if (inValue[0] === `val_g_pers_guy`) {
              database.updatePartialData(inMember.user.id, { пол_игрока: `${pols(`мужской`)}` }, `gameprofile`, async (upPol) => {
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
                  color: Number.parseInt(`25ff00`, 16)
                }
                );
              });//Запись
            } else if (inValue[0] === `val_g_pers_woman`) {
              database.updatePartialData(inMember.user.id, { пол_игрока: `${pols(`женский`)}` }, `gameprofile`, async (usPol) => {
                if (usPol === undefined) {
                  return conErr(`SELECT_MENU`, `Создание персонажа | Пол. Краш 5`);
                }
                if (typeof usPol != `object`) {
                  return conErr(`SELECT_MENU`, `Создание персонажа | Пол. Краш 6`);
                }
                await inReply(2, {
                  title: `Создание персонажа`,
                  description: `Пол персонажа: ${pols(`женский`)}`,
                  color: Number.parseInt(`25ff00`, 16)
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
              color: Number.parseInt(`25ff00`, 16),
              footer: {
                text: `Вы не можете повторно выбрать пол для персонажа!`
              }
            }
            );
          }
        }
      });//БД профиля
      */
    }

    if (inCustom === "sel_g_pers_race") {
      // TODO: Выбор расы
      isReply({ interaction, message: { content: "Будет реализовано позже", ephemeral: true } });
      /*database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, rase => {
        if (rase === undefined) {
          return conErr(`SELECT_MENU`, `Создание персонажа | Раса. Краш 2`);
        }
        if (rase === null) {
          return inReply(2, {
            title: `Создание персонажа`,
            description: `Похоже вас не записало в Базу Данных. Обратитесь к администрации бота.`,
            color: Number.parseInt(`ff2500`, 16)
          }
          );
        }
        if (rase?.раса_игрока.length >= 3) {
          return inReply(2, {
            title: `Создание персонажа`,
            description: `Раса персонажа: ${rase?.раса_игрока}`,
            color: Number.parseInt(`25ff00`, 16),
            footer: {
              text: `Вы не можете повторно выбрать расу для своего персонажа`
            }
          }
          );
        }
        const rChar = inCrePers.rase_char(inValue[0]);
        if (rase != null) {
          const ohNo = {
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
              color: Number.parseInt(`25ff00`, 16)
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
      });*/
    }
    if (inCustom === "sel_g_pers_obr") {
      // TODO: Выбор обращения
      isReply({ interaction, message: { content: "Будет реализовано позже", ephemeral: true } });
      /* database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, async (obr) => {
         if (obr === undefined) {
           return conErr(`SELECT_MENU`, `Создание персонажа | Обращение. Краш 2`);
         }
         if (obr === null) {
           return await inReply(2, {
             title: `Создание персонажа`,
             description: `Похоже вас не записало в Базу Данных. Обратитесь к администрации бота.`,
             color: Number.parseInt(`ff2500`, 16)
           }
           );//Ответ
         }
         if (obr != null) {
           if (obr?.обращение.length >= 3) {
             return await inReply(2, {
               title: `Создание персонажа`,
               description: `Извините. Но повторно изменить обращение можно только с помощью [команды, что сейчас нет] или обратитесь к администрации бота.`,
               color: Number.parseInt(`ff2500`, 16),
               footer: {
                 text: `Ваше обращение: ${obr?.обращение}`
               },
             }
             );//Ответ
           }
           if (obr?.обращение.length <= 2) {
             database.updatePartialData(inMember.user.id, { обращение: inCrePers.obr(inValue[0]) }, `gameprofile`, upObr => {
               if (upObr === undefined) {
                 return conErr(`SELECT_MENU`, `Создание персонажа | Обращение. Краш. 3`);
               }
               if (typeof upObr != `object`) {
                 return conErr(`SELECT_MENU`, `Создание персонажа | Обращение. Краш 4`);
               }
               inReply(2, {
                 title: `Создание персонажа`,
                 description: `Обращение к вам: ${inCrePers.obr(inValue[0])}`,
                 color: Number.parseInt(`25ff00`, 16),
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
       */
    }

  }
}
