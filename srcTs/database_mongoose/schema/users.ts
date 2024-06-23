import { IUsers } from "@type/database_mongoose/schema/users";
import { Model, model, Schema } from "mongoose";

const usersShema = new Schema<IUsers, Model<IUsers>>({
  _id: { type: Schema.Types.ObjectId, required: true },
  id: { type: String, required: true },
  username: { type: String, default: `Ошибка/Не указано` },
  info: {
    dostup: {
      base: { type: String, default: `Гость` },
      reader: { type: String, default: `F` },
      additional_access: [{ type: String, default: [] }],
    },
    dn: { type: Number, default: 0 },
    pol: { type: String, default: `Не выбран` },
    perms: { type: Number, default: 0 },
    tityl: [{ type: String, default: `Отсуствует` }],
    bio: { type: String, default: `Вы можете изменить **Информация о пользователе** с помощью **/newinfo**` },
    potion: { type: Number, default: 0 }, //0-100, где 100 - это чтец
  },
  level: {
    global: {
      rank: {
        xp: { type: Number, default: 0 }, //опыт
        level: { type: Number, default: 0 }, //уровень
        max_xp: { type: Number, default: 125 }, //сколько до следующего уровня. Пока 300.
        next_xp: { type: String, default: `${new Date().getTime() + 10 * 60 * 1000}` }, //когда будет новое накопление опыта. new Date().getTime() + (10 * 60 * 1000)
      },
    },
    /* prettier-ignore */
    local: [{ 
      rank: { type: Schema.Types.ObjectId, ref: `local_xp` },
      id: { type: String, required: true },
    }],
  },
  pechenie: { type: Number, default: 0 },
  clan: { type: Schema.Types.ObjectId, ref: `clans` },
});

const Users = model(`users`, usersShema);

export { Users, IUsers };
