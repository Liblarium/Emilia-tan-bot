const { readdirSync } = require(`node:fs`);
const { connection } = require(`mongoose`);

module.exports = async (emilia) => {
  readdirSync(`./Events`)
    .forEach(folder => {
  readdirSync(`./Events/${folder}`)
    .filter(files => files.endsWith(`.js`))
      .forEach(file => {
    try {
    const event = require(`../Events/${folder}/${file}`);
    if (folder == `mongo`) event.mongo = true; else event.mongo = false;
    emilia.events.set(event.name);
    if (event.rest) { // / команды
        if (event.once) {
            emilia.rest.once(event.name, (...args) => event.execute(...args, emilia));
        } else {
            emilia.rest.on(event.name, (...args) => event.execute(...args, emilia));
        }
    } if (event.mongo) { // Mongo
        if (event.once) connection.once(event.name, (...args) => event.execute(...args, emilia));
        else connection.on(event.name, (...args) => event.execute(...args, emilia));
    } else { // обычные
        if (event.once) {
            emilia.once(event.name, (...args) => event.execute(...args, emilia));
      } else {
            emilia.on(event.name, (...args) => event.execute(...args, emilia));
      };
    }
    } catch (error) {
      console.log(error);
    };
      });
    });
};