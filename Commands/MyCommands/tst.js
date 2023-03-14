const { SlashCommandBuilder } = require(`discord.js`);
const { conErr } = require(`${process.cwd()}/config.js`);
module.exports = {
    data: new SlashCommandBuilder()
    .setName(`test`)
    .setDescription(`Тестовая команда. Ограниченный доступ`),
    async execute (interaction, emilia) {
        if ([`211144644891901952`, `357203448640307201`].includes(interaction.member.user.id)) {
            interaction.reply({embeds: [{
                title: `Акра-кадабра`,
                description: `yas, <@211144644891901952>`,
            }], components: [{
                components: [{
                    custom_id: `but_tst_test`,
                    label: `test`,
                    style: 2,
                    type: 2,
                }],
                type: 1,
            }], ephemeral: true});
        } else return interaction.reply({ content: `Эта команда вам не доступна`, ephemeral: true })
    }
};