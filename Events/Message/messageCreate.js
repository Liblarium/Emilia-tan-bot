module.exports = {
  name: `messageCreate`,
  async execute (message, emilia) {
    require(`./message`)(message, emilia);
  } //execute
} //export 