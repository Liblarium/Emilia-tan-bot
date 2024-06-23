/*const { Database } = require(`@js/Database`);
const { Log } = require(`../../../Log`).default;

class Guild {
  constructor(message, client) {
    this.message = message;
    this.client = client;
    this.db = new Database();
  }

  async #checkServer() {
    const checkServer = await this.db.getData({ id: this.message.guild.id }, `guildSetting`);
  }

  #addServer() {

  }

  server() {

  }
}
*/
