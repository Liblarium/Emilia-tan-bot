const { SlashCommandBuilder } = require(`discord.js`);
module.exports = {
    data: new SlashCommandBuilder()
    .setName(`пинг`)
    .setDescription(`Пинг бота`),
    async execute (interaction, emilia) {
        console.log(`[${emilia.times()}][${emilia.user.username} | Пинг]: ${emilia.ws.ping} ms`);
        interaction.reply({ embeds: [{description: `Мой пинг: ${emilia.ws.ping} ms.`, color: interaction.member.displayColor != `0` ? interaction.member.displayColor : `7180443`}], ephemeral: true });
    }
}