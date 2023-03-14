const { readdirSync } = require(`node:fs`);

module.exports = async (emilia) => {
  await emilia.slashcommands.clear();
  readdirSync(`./Commands`)
    .forEach(folder => {
  readdirSync(`./Commands/${folder}`)
    .filter(cmdFile => cmdFile.endsWith(`.js`))
      .forEach(async (file) => {
    try {
      const comms = require(`../Commands/${folder}/${file}`);
      if (!comms.data) {
      if (comms.option == undefined) return console.log(comms, `Не правильно введена переменная`);
        emilia.commands.set(comms.name, comms);
      } else {
        emilia.slashcommands.set(comms.data.name, comms);
      }
    } catch (error) {
        console.log(error)
      };
    });
  });
}