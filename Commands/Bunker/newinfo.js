const { SlashCommandBuilder } = require(`discord.js`);
const { conErr } = require(`${process.cwd()}/config.js`);
module.exports = {
    data: new SlashCommandBuilder()
    .setName(`newinfo`)
    .setDescription(`Установить новую информацию о себе`)
    .addStringOption(option => option.setName(`обновление`).setDescription(`Текст больше 1024 символов не принимается`).setRequired(true)),
    async execute (interaction, emilia) {
    const { database } = require(`${process.cwd()}/Database/database.js`);
    database.fetchData(`id`, `${interaction.member.user.id}`, `users`, usr => {
    if (usr === undefined) return conErr(`${interaction.commandName} (/)`, `Ошибка при проверке наличия пользоваателя (0)[0]`);
    if (usr === null) return interaction.reply({embeds: [{
        title: `Обновление информации о себе`,
        description: `Похоже вас нет в Базе Данных.`,
        color: `${parseInt(`ff2500`, 16)}`,
        footer: {
            text: `Эта команда доступна для людей, что есть в Базе Данных.`,
        },
    }], 
    ephemeral: true });
    const string = interaction.options.getString(`обновление`);
    if (string.length >= 1025) {
        return interaction.reply({embeds: [{
            title: `Обновление информации о себе`,
            description: `Вы ввели больше 1024 (${string.length}) символов!`,
            color: `${parseInt(`ff2500`, 16)}`,
            footer: {
                text: `Введите меньше 1025 символов.`
            }
        }],
        ephemeral: true
        });
    } else {
        database.updatePartialData(interaction.member.user.id, { info: `${string}`}, `users`, upuser => {
            if (upuser === undefined) return conErr(`${interaction.commandName} (/)`, `Ошибка при обновлении информации пользователя (0)[1]`);
            if (typeof upuser != 'object') return conErr(`${interaction.commandName} (/)`, `Произошла ошибка во время записи (1)[1]`);
            interaction.reply({ embeds: [{
                title: `Обновление информации о себе`,
                description: `Ваша информация о вас была обновлена. Можете глянуть с помощью </profile:1018822028565946379>`,
                color: `${parseInt(`25ff00`, 16)}`,
                footer: {
                    text: `Размер нового описания: ${string.length}`,
                },
            }],
                ephemeral: true,
            });
        }); //Запись в БД.
    }
    }); //БД профиля
    }
}