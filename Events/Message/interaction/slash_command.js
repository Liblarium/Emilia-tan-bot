class isSlash {
    constructor(type, emilia) {
        this.type = type;
        this.emilia = emilia;
    }
    on (type, emilia) {
        const slas_command = emilia.slashcommands.get(type.commandName);
        if (!slas_command) { 
            return type.reply({ content: `Такой команды нет.`, ephemeral: true }); 
        }
        if (slas_command.developer && type.user.id !== `211144644891901952`) {
            return type.reply({ content: `Эта команда доступна только создателю.`, ephemeral: true });
        }
    let interaction = type;
    slas_command.execute(interaction, emilia);
    }
}
exports.isSlash = new isSlash();