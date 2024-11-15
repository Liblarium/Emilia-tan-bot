/*const { Database } = require(`../../../Database`);
const { Log } = require(`../../../Log`).default;

class Member {
  constructor(message, client) {
    this.message = message;
    this.client = client;
    this.db = new Database();
  }

  /**
   * 
   * @returns { Promise<boolean | void> }
   *\/
  async #checkUser() {
    const message = this.message;
    const db = this.db;

    const checkUser = await db.getData({ id: message.member.user.id }, `users`);

    if (checkUser.status === null) {
      new Log({ text: checkUser.error, type: 2, db: true, categories: [`global`, `database`] });
      return;
    }
    if (!checkUser.res) return false;
    return true;
  }

  /**
   * 
   * @returns {Promise<{ error: null | string, res: any | null, status: boolean | null }>}
   *\/
  async #addUser() {
    const message = this.message;
    const db = this.db;
    const checkUser = await this.#checkUser();

    switch (checkUser) {
      case false: {
        const newUser = await db.upsertData({
          id: message.member.user.id,
          username: message.member.user.username,
          info: {
            dostup: [`Гость`],
            dn: 0,
            pol: `Не выбран`,
            perms: 0,
            titul: [`Отсутствует`],
            bio: `Вы можете изменить **Информация о пользователе** с помощью **\/newinfo**`
          },
          clan: {},
          pechenie: 0,
          rank: {
            global: {
              xp: 0,
              level: 0,
              max_xp: 300,
              next_xp: `${new Date().getTime() + 10 * 60 * 1000}`
            },
            local: {}
          }
        }, `users`);

        return { error: newUser.error, res: newUser.res, status: newUser.status };
      }
      case true: return { error: null, res: null, status: false };
      case undefined:
      default: return { error: `Произошла неизвестная ошибка.`, res: null, status: null };
    }

  }

  /**
   * 
   * @returns {Promise<{ error: null | string, res: any | null, status: boolean | null }>}
   *\/
  async user() {
    const message = this.message;
    const db = this.db;

    if (message.webhookId) return { error: null, res: null, status: null };

    const user = await db.fetchData(`id`, message.member.user.id, `users`);

    if (user.status === null) return user;
    if (user.status === false) {
      const newUser = await this.#addUser();

      if (newUser.error) return newUser;
      return await db.fetchData(`id`, newUser.user.id, `users`);
    }

    return user;
  }
}

module.exports = { Member };*/
