const { isSlash } = require(`./slash_command.js`);
const { isButtons } = require(`./button.js`);
const { isGame } = require(`./game.js`);
const { isMenu } = require(`./menu.js`);
const { isModal } = require(`./modal.js`);
const { isPrivateVoice: isVoice } = require(`./voise.js`);
class IntCompsHandler {
    constructor(type, emilia) {
        this.type = type;
        this.emilia = emilia;
    }
    /**
     * 
     * @param {type} type интеракция (interaction) 
     * @param {emilia} emilia клиент бота 
     * @description Эта часть кода предназначена для основных 4 файлов [команды, кнопки, меню, окна]
     */
    on(type, emilia) {
        if (type.isChatInputCommand()) {
            isSlash.on(type, emilia); //команды
        }
        if (type.isButton()) {
            isButtons.on(type, emilia); //кнопки
        }
        if (type.isStringSelectMenu()) {
            isMenu.on(type, emilia); //меню
        }
        if (type.isModalSubmit()) {
            isModal.on(type, emilia); //окна
        }
    }
    /**
     * 
     * @param {interaction} type интеракция (interaction) 
     * @param {client} emilia клиент бота 
     * @description Эта часть кода предназначена для кастомных классов, что не относятся к классам выше
     */
    custom(type, emilia) {
        isGame.on(type, emilia);
        require(`./orders`)(type, emilia);
        isVoice.on(type, emilia);
    }
}
exports.IntCompsHandler = new IntCompsHandler();