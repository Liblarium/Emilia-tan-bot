import type { EmiliaClient } from "@client";
import { isReply } from "@util/s";
import type { ModalSubmitInteraction } from "discord.js";

export class ModalComponent {
  constructor(interaction: ModalSubmitInteraction, client: EmiliaClient) {
    this.build(interaction, client);
  }

  /**
   * @param interaction
   * @param client
   */
  private build(interaction: ModalSubmitInteraction, client: EmiliaClient) {
    const inCustom = interaction.customId;
    /*const inMember = interaction.member;
    const inUser = interaction.user;
    const inGuild = interaction.guild;
    const inMessage = interaction.message;
    const inChannel = interaction.channel;*/
    const inValCustom = interaction.components[0].components[0].customId;
    const inValVal =
      interaction.components[0].components[0].value.toLowerCase();

    if (inCustom === "modal_custom") {
      console.log(interaction.components[0].components[0]);
    }
    if (inCustom === "bruh_mod_test") {
      isReply({ interaction, message: { content: `${inValVal}`, ephemeral: true } });
    }

    if (inCustom === "bruh_modal") {
      isReply({ interaction, message: { content: "Вау", ephemeral: true } });
      console.log(interaction.components[0].components);
    }
    if (inCustom === "mod_g_name") {
      // TODO: Имя персонажа
      isReply({ interaction, message: { content: "Не реализовано", ephemeral: true } });
      /*
      database.fetchData(`id`, `${inUser.id}`, `gameprofile`, (gam) => {
        if (gam === undefined)
          return (
            inReply(1, `Что-то пошло не так`), conErr(`mod_g_name`, `Краш 1`)
          );
        if (inValCustom === `val_g_name`) {
          database.upsertData(
            {
              id: `${inUser.id}`,
              имя_игрока: `${inUser.username}`,
              имя_персонажа: `${inComponent.intComponent(0, 0).value}`,
            },
            `gameprofile`,
            (name) => {
              if (name === undefined) return console.log(`Краш 2`);
              if (typeof name != `object`) return console.log(`Краш 3`);
              console.log(`Записано`);
              inComponent.mesComponent(0, 0).disabled = true;
              inComponent.mesComponent(0, 1).disabled = false;
              inComponent.mesComponent(0, 0).style = 3;
              inComponent.mesComponent(0, 1).style = 4;
              inMessage.edit({
                embeds: [
                  {
                    title: `Создание персонажа:`,
                    description: `**Имя**: ${inComponent.intComponent(0, 0).value}\n**Раса**: ${allRase.join(`, `)}\n**Обращение**: скип, пропустить, девушка, парень\n**Пол**: Мужской или Женский.`,
                    color: Number.parseInt(`25ff00`, 16),
                  },
                ],
                components: [inComponent.message(0)],
              });
              inReply(1, `Записано`);
            },
          ); //БД профиля изменение
        }
      });
      */
    }

    if (inCustom === "mod_g_race") {
      // TODO: Раса персонажа
      isReply({ interaction, message: { content: "Не реализовано", ephemeral: true } });
      /*
      database.fetchData(`id`, `${inUser.id}`, `gameprofile`, (gam) => {
        if (gam === undefined)
          return (
            conErr(`mod_g_race`, `Краш 1 (2)`),
            inReply(1, `Что-то пошло не так 2`)
          );
        if (inValCustom === `val_g_race`) {
          const rases = [];
          const olRase = rases.concat(allRase.map((i) => i.toLowerCase()));
          if (olRase.includes(inValVal)) {
            database.updatePartialData(
              inUser.id,
              { раса_игрока: `${inCrePers.rase(inValVal)}` },
              `gameprofile`,
              (race) => {
                if (race === undefined)
                  return (
                    inReply(1, `Что-то пошло не так`),
                    conErr(`mod_g_race`, `Краш 2 (2)`)
                  );
                if (typeof race != `object`) return console.log(`Краш 3 (2)`);
                console.log(`Записано (2)`);
                inReply(1, `Записано!`);
                inComponent.mesComponent(0, 1).disabled = true;
                inComponent.mesComponent(0, 1).style = 3;
                inComponent.mesComponent(0, 2).disabled = false;
                inComponent.mesComponent(0, 2).style = 4;
                inMessage.edit({
                  embeds: [
                    {
                      title: `Создание персонажа:`,
                      description: `**Имя**: ${gam.имя_персонажа}\n**Раса**: ${inCrePers.rase(inValVal)}\n**Обращение**: скип, пропустить, девушка, парень\n**Пол**: Мужской или Женский.`,
                      color: Number.parseInt(`25ff00 `, 16),
                    },
                  ],
                  components: [inComponent.message(0)],
                });
              },
            );
          } else {
            return inReply(2, {
              title: `Раса персонажа`,
              color: Number.parseInt(`ff0000`, 16),
              description: `${inCrePers.rase(inValVal)}`,
              footer: {
                text: `Доступные расы: ${allRase.join(`, `)}`,
              },
            });
          }
        }
      });
      */
    }

    if (inCustom === "mod_g_obr") {
      // TODO: Обращение персонажа
      isReply({ interaction, message: { content: "Не реализовано", ephemeral: true } });
      /*
      database.fetchData(`id`, `${inUser.id}`, `gameprofile`, (gam) => {
        if (gam === undefined) return inReply(1, `Что-то пошло не так 1 (3)`);
        if ([`скип`, `пропустить`, `девушка`, `парень`].includes(inValVal)) {
          database.updatePartialData(
            inUser.id,
            { обращение: `${inCrePers.obr(inValVal)}` },
            `gameprofile`,
            (obr) => {
              if (obr === undefined) return conErr(`mod_g_orb`, `Краш 2 (3)`);
              if (typeof obr != `object`)
                return conErr(`mod_g_obr`, `Краш 3 (3)`);
              console.log(`Записано`);
              inComponent.mesComponent(0, 2).disabled = true;
              inComponent.mesComponent(0, 2).style = 3;
              inComponent.mesComponent(0, 3).disabled = false;
              inComponent.mesComponent(0, 3).style = 4;
              inMessage.edit({
                embeds: [
                  {
                    title: `Создание персонажа:`,
                    description: `**Имя**: ${gam.имя_персонажа}\n**Раса**: ${gam.раса_игрока}\n**Обращение**: ${inValVal}\n**Пол**: Мужской или Женский.`,
                    color: Number.parseInt(`25ff00`, 16),
                  },
                ],
                components: [inComponent.message(0)],
              });
              inReply(1, `Записано`);
            },
          );
        } else {
          return inReply(2, {
            title: `Создание персонажа:`,
            description: `${inCrePers.obr(inValVal)}`,
            color: Number.parseInt(`ff0000`, 16),
          });
        }
      });
      */
    }

    if (inCustom === "mod_g_pol") {
      // TODO: Пол персонажа
      /*
      database.fetchData(`id`, `${inUser.id}`, `gameprofile`, (gam) => {
        if (gam === undefined) return inReply(1, `Что-то пошло не так 1 (4)`);
        if ([`мужской`, `женский`].includes(inValVal)) {
          database.updatePartialData(
            inUser.id,
            { пол_игрока: `${inCrePers.pers_pol(inValVal)}` },
            `gameprofile`,
            (pol) => {
              if (pol === undefined) return conErr(`mod_g_pol`, `Краш 2 (4)`);
              if (typeof pol != `object`)
                return conErr(`mod_g_pol`, `Краш 3 (4)`);
              console.log(`Записано`);
              inMessage.edit({
                embeds: [
                  {
                    title: `Созданный персонаж:`,
                    description: `**Имя**: ${gam.имя_персонажа}\n**Раса**: ${gam.раса_игрока}\n**Обращение**: ${gam.обращение}\n**Пол**: ${inCrePers.pers_pol(inValVal)}.`,
                    color: Number.parseInt(`25ff00`, 16),
                    footer: {
                      text: `${inCrePers.pol(gam.обращение)} ${inUser.tag}`,
                    },
                  },
                ],
                components: [],
              });
              inReply(1, `Записано`);
            },
          );
        } else {
          return inReply(2, {
            title: `Создание персонажа:`,
            description: `${inCrePers.pers_pol(inValVal)}`,
            color: Number.parseInt(`ff0000`, 16),
          });
        }
      });
      */
    }

    if (inCustom === "mod_verif" && inValCustom === "mod_val_vefir") {
      isReply({ interaction, message: { content: `${interaction.components[0].components[0].value}`, ephemeral: true } });
    }

    if (inCustom === "mod_g_reg") {
      // TODO: Регистрация
      isReply({ interaction, message: { content: "Не реализовано", ephemeral: true } });
      /*
      const val = Number.parseInt(inValVal);
      if (val == inValCustom) {
        database.upsertData(
          {
            id: `${inMember.user.id}`,
            u_name: `${inMember.user.username}`,
            g_uid: `${inGuild.id}`,
            g_name: `${inGuild.name}`,
            g_reg: `${inGuild.id}`,
            perms: `Игрок`,
          },
          `register`,
          async (reg) => {
            if (reg === undefined)
              return conErr(`MODAL`, `Регистрация. Краш 2`);
            if (typeof reg != `object`)
              return conErr(`MODAL`, `Регистрация. Краш 3`);
            database.upsertData(
              {
                id: `${inMember.user.id}`,
                имя_игрока: `${inMember.user.username}`,
              },
              `gameprofile`,
              async (gReg) => {
                if (gReg === undefined)
                  return conErr(`MODAL`, `Регистрация. Краш 4`);
                if (typeof gReg != `object`)
                  return conErr(`MODAL`, `Регистрация. Краш 5`);
                await inReply(2, {
                  title: `Регистрация`,
                  description: `Вы завершили регистрацию. Создайте персонажа и вы будете полноценным игроком!)`,
                  color: Number.parseInt(`25ff00`, 16),
                  footer: {
                    text: `Регистрация завершена`,
                    iconURL: `${inMember.displayAvatarURL({ dynamic: true })}`,
                  },
                });
              },
            ); //БД профиля
          },
        ); //БД регистрацию
      } else {
        inReply(2, {
          title: `Регистрация`,
          description: `Вы ввели не правильный код. Введите снова.`,
          color: Number.parseInt(`ff2500`, 16),
        });
      }*/
    }

    if (inCustom === "mod_g_pers_name") {
      // TODO: Имя персонажа
      isReply({ interaction, message: { content: "Не реализовано", ephemeral: true } });
      /*database.fetchData(
        `id`,
        `${inMember.user.id}`,
        `gameprofile`,
        async (names) => {
          if (names === undefined) {
            return conErr(`MODAL`, `Создание персонажа | Имя. Краш 2.`);
          }
          if (names === null) {
            return await inReply(2, {
              title: `Создание персонажа`,
              description: `Похоже вас не записало в Базу Данных. Обратитесь к администрации бота.`,
              color: Number.parseInt(`ff2500`),
            });
          }
          if (names?.имя_персонажа.length >= 3) {
            return await inReply(2, {
              title: `Создание персонажа`,
              description: `Имя: ${names?.имя_персонажа}`,
              color: Number.parseInt(`25ff00`, 16),
              footer: {
                text: `Ваш персонаж имеет Имя. Повторно оно не меняется.`,
              },
            });
          }
          if (names?.имя_персонажа.length <= 3) {
            database.fetchData(
              `имя_персонажа`,
              `${inComponent.intComponent(0, 0).value}`,
              `gameprofile`,
              async (gName) => {
                if (gName === undefined) {
                  return conErr(`MODAL`, `Создание персонажа | Имя. Краш 3.`);
                }
                if (gName != null) {
                  return await inReply(2, {
                    title: `Создание персонажа`,
                    description: `Данное имя занято. Придумайте другое.`,
                    color: Number.parseInt(`ff2500`, 16),
                  });
                } else if (gName === null) {
                  database.updatePartialData(
                    inMember.user.id,
                    { имя_персонажа: inComponent.intComponent(0, 0).value },
                    `gameprofile`,
                    (upGame) => {
                      if (upGame === undefined) {
                        return conErr(
                          `MODAL`,
                          `Создание персонажа | Имя. Краш 4`,
                        );
                      }
                      if (typeof upGame != `object`) {
                        return conErr(
                          `MODAL`,
                          `Создание персонажа | Имя. Краш 5`,
                        );
                      }
                      inReply(2, {
                        title: `Создание персонажа`,
                        description: `Имя персонажа: ${inComponent.intComponent(0, 0).value}`,
                        color: Number.parseInt(`25ff00`, 16),
                      });
                      if (names?.родословная.length < 1) {
                        database.updatePartialData(
                          inMember.user.id,
                          { родословная: `${blood()}` },
                          `gameprofile`,
                          async (bloods) => {
                            if (bloods === undefined) {
                              return conErr(
                                `MODAL`,
                                `Создание персонажа | Родословная (Имя). Краш 1`,
                              );
                            }
                            if (typeof bloods != `object`) {
                              return conErr(
                                `MODAL`,
                                `Создание персонажа | Родословная (Имя). Краш 2`,
                              );
                            }
                          },
                        ); //Запись
                      } else {
                        return;
                      }
                    },
                  ); //Запись
                }
              },
            ); //Проверка на наличие повторения имени;
          }
        },
      ); //БД профиля
      */
    }

    if (inCustom === "mod_g_pers_age") {
      // TODO: Возраст персонажа
      isReply({ interaction, message: { content: "Не реализовано", ephemeral: true } });
      /* //Да тут "говнокода" куча. Но позже перепишу
      const inValue = inComponent.intComponent(0, 0).value;
      const valAge = [
        `0`,
        `1`,
        `2`,
        `3`,
        `4`,
        `5`,
        `6`,
        `7`,
        `8`,
        `9`,
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
      ];
      database.fetchData(`id`, `${inMember.user.id}`, `gameprofile`, (age) => {
        if (age === undefined) {
          return conErr(`MODAL`, `Создание персонажа | Возраст. Краш 2`);
        }
        if (age === null) {
          return inReply(2, {
            title: `Создание персонажа`,
            description: `Похоже вас не записало в Базу Данных. Обратитесь к администрации бота.`,
            color: Number.parseInt(`ff2500`, 16),
          });
        }
        if (age?.возраст_персонажа >= 14) {
          return inReply(2, {
            title: `Создание персонажа`,
            description: `Возраст вашего персонажа: ${age?.возраст_персонажа}`,
            color: parseInt(`25ff00`, 16),
            footer: {
              text: `Вы не можете повторно ввести возраст персонажа.`,
            },
          });
        }
        if (age != null) {
          if (
            !valAge.includes(inValue.charAt(0)) ||
            !valAge.includes(inValue.charAt(1)) ||
            !valAge.includes(inValue.charAt(2)) ||
            !valAge.includes(inValue.charAt(3))
          ) {
            return inReply(2, {
              title: `Создание персонажа`,
              description: `Возраст принимает только числа.`,
              color: Number.parseInt(`ff2500`, 16),
            });
          }
          if (Number.parseInt(inValue.charAt(0)) < 1) {
            return inReply(2, {
              title: `Создание персонажа`,
              description: `Возраст персонажа не может начинаться с 0.`,
              color: Number.parseInt(`ff2500`, 16),
            });
          }
          const num = Number.parseInt(inValue);
          if (Number.isNaN(num)) {
            return inReply(2, {
              title: `Создание персонажа`,
              description: `Возраст - это числа, а не буквы.`,
              color: Number.parseInt(`ff2500`, 16),
            });
          }
          if (inValue <= 13) {
            return inReply(2, {
              title: `Создание персонажа`,
              description: `Возраст ниже 14 - не принимается. 14 лет - минимум (не нужно вводить "лет").`,
              color: Number.parseInt(`ff2500`, 16),
            });
          }
          if (inValue >= 14) {
            database.updatePartialData(
              inMember.user.id,
              { возраст_персонажа: inValue },
              `gameprofile`,
              (upAge) => {
                if (upAge === undefined) {
                  return conErr(
                    `MODAL`,
                    `Создание персонажа | Возраст. Краш 3`,
                  );
                }
                if (typeof upAge != `object`) {
                  return conErr(
                    `MODAL`,
                    `Создание персонажа | Возраст. Краш 4`,
                  );
                }
                inReply(2, {
                  title: `Создание персонажа`,
                  description: `Возраст персонажа: ${inValue}`,
                  color: Number.parseInt(`25ff00`, 16),
                });
                if (age?.родословная.length < 1) {
                  database.updatePartialData(
                    inMember.user.id,
                    { родословная: `${blood()}` },
                    `gameprofile`,
                    async (bloods) => {
                      if (bloods === undefined) {
                        return conErr(
                          `MODAL`,
                          `Создание персонажа | Родословная (Возраст). Краш 1`,
                        );
                      }
                      if (typeof bloods != `object`) {
                        return conErr(
                          `MODAL`,
                          `Создание персонажа | Родословная (Возраст). Краш 2`,
                        );
                      }
                    },
                  ); //Запись
                } else {
                  return;
                }
              },
            ); //Запись
          }
        }
      }); //БД профиля
      */
    }

    if (inCustom === "mod_test") {
      console.log("i work");
      console.log(interaction);
      console.log(interaction.message?.components[0].components.map(i => i.data));
      interaction.reply({ content: "i work", ephemeral: true });
    }
  }
}
