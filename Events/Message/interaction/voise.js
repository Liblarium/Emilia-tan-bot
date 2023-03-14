class isPrivateVoice {
    constructor(type, emilia) {
        this.type = type;
        this.emilia = emilia;
    }
    on(type, emilia) {
        const inCustom = type.customId;
        const inMember = type.member;
        const inUser = type.user;
        const inGuild = type.guild;
        const inMessage = type.message;
        const inChannel = type.channel;
        const voice = `voice.but_`;
        let inValue = type.values;
        class inComponents extends isPrivateVoice {
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
        if (type.isButton()) { //кнопки
    if (inCustom === `${voice}name`) {
      type.reply({content: `Пока без функционала`, ephemeral: true}); //модальное окно сделать
    }
        }
        if (type.isStringSelectMenu()) { //меню

        }
        if (type.isModalSubmit()) {//модалки

        }
    }
}

exports.isPrivateVoice = new isPrivateVoice;