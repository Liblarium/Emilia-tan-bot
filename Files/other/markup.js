module.exports = () => {
    return {
        reply_markup: JSON.stringify({
        inline_keyboard: [
            [{
                text: `Кейс 1`, callback_data: `first`,
            }, {
                text: `Кейс 2`, callback_data: `second`,
            }]
        ]
        })
    }
}

