const { SlashCommandBuilder } = require(`discord.js`);
const { prefix } = require(`${process.cwd()}/config.js`).config_client;
const { conErr } = require(`${process.cwd()}/config.js`);
module.exports = {
    data: new SlashCommandBuilder()
    .setName(`prefix`)
    .setDescription(`Просмотр префикса бота`),
    async execute (interaction, emilia) {
    const { database } = require(`${process.cwd()}/Database/database.js`);
    database.fetchData(`guID`, `${interaction.guild.id}`, `guild_setting`, st => {
        if (st === undefined) return conErr(`${interaction.commandName} (/)`, `Краш при проверке на наличие сервера в БД! (0)[0]`);
        let pref;
        if (st === null) pref = prefix;
        if (st !== null) pref = st.pref;
        interaction.reply({embeds: [{
            title: `Префикс бота`,
            description: `Установленный на сервер префикс: **${pref}**. Стандартный префикс: **${prefix}**`,
            color: parseInt(`25ff00`, 16),
        }],
            ephemeral: true,
        });
    }); // БД настройки сервера
    }
}