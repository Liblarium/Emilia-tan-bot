const { isButton } = require(`./button.js`);
const { isMenu } = require(`./menu.js`);
const { isModal } = require(`./modal.js`);

module.exports = (type, client) => {
    if (type.isButton()) {
        isButton.on(type, client); //кнопки
    }
    if (type.isStringSelectMenu()) {
        isMenu.on(type, client); //меню
    }
    if (type.isModalSubmit()) {
        isModal.on(type, client); //окна
    }
}