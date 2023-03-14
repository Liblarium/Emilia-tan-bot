module.exports = {
    name: `voiceStateUpdate`,
    async execute(oldState, newState, emilia) {
        require(`./private_voice/newVoice.js`)(newState, emilia);
        require(`./private_voice/oldVoice.js`)(oldState);
    }
}
