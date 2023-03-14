const { SlashCommandBuilder } = require(`discord.js`);
const { time } = require(`${process.cwd()}/config.js`);
module.exports = {
    data: new SlashCommandBuilder()
    .setName(`time`)
    .setDescription(`Глянуть на время хоста`),
    async execute (interaction, emilia) {
        let colors;
        if (new Number(interaction.member.user.displayColor) == 0) { colors = parseInt(`48dfbf`, 16) } else if (new Number(interaction.member.user.displayColor) != 0) { colors = interaction.member.user.displayColor; }
        interaction.reply({embeds: [{
            title: `Время:`,
            description: `Сейчас у хоста: **${time()}**`,
            timestamp: new Date(),
            color: colors,
            footer: {
                text: `\u200b`, 
                iconURL: interaction.member.displayAvatarURL({ dynamic: true}),
            }
        }], 
            ephemeral: true});
    }
}