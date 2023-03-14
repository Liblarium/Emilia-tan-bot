const { on, custom } = require(`./interaction`).IntCompsHandler;
module.exports = {
    name: `interactionCreate`,
    async execute (interaction, emilia) {
        on(interaction, emilia);  
        custom(interaction, emilia);
    }
}