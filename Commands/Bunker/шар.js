const { SlashCommandBuilder } = require(`discord.js`);
const { sharAll } = require(`${process.cwd()}/Files/index.js`).shar;
module.exports = {
    data: new SlashCommandBuilder()
    .setName(`шар`)
    .setDescription(`Задай вопрос боту - она ответит тебе`)
    .addStringOption(option => option.setName(`вопрос`).setDescription(`Введи вопрос для получения ответа`).setRequired(true))
    .addBooleanOption(option => option.setName(`приватность`).setDescription(`Будет ли виден ответ всем или только вам (можно не трогать)`).setRequired(false)),
    async execute (interaction, emilia) {
        let privates = interaction.options.getBoolean(`приватность`);
        let colors;
        const user = interaction.guild.members.cache.get(interaction.user.id);
        privates ??= false;
        if (new Number(user.displayColor) == 0) { 
            colors = parseInt(`48dfbf`, 16) 
        } else if (new Number(user.displayColor) != 0) { 
            colors = user.displayColor; 
        }
            await interaction.reply({embeds: [{
                title: `Вопрос:`, 
                description: `${interaction.options.getString(`вопрос`)}`,
                fields: [{
                    name: `Ответ:`,
                    value: `\u000A${sharAll[Math.floor(Math.random() * sharAll.length)]}`,
                }],
                color: colors,
            }], ephemeral: privates});
    }
}