class isGame {
    constructor(type, emilia) {
        this.type = type;
        this.emilia = emilia;
    }
    on(type, emilia) {
        const isButton = type.isButton();
        const isMenu = type.isStringSelectMenu();
        const isModal = type.isModalSubmit();
        const isCustom = type.customId; //custom_Id
        let isLocalOption = {};

        if (isButton) { //зона кнопок

        }
        if (isMenu) { //зона меню

        }
        if (isModal) { //зона окон

        }
    }
}
exports.isGame = new isGame();