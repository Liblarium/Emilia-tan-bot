import { IGameUsers } from "@type/database_mongoose/schema/game.users";
import { model, Model, Schema } from "mongoose";

const gameUsersSchema = new Schema<IGameUsers, Model<IGameUsers>>({
  _id: { type: Schema.Types.ObjectId },
  id: { type: String, required: true }, // id в дискорде
  created: { type: String, required: true }, // когда был создан профиль в "игре"
  username: { type: String, required: true }, // имя пользователя в дисе
  profile: { type: Schema.Types.ObjectId, ref: `gameProfile` }, //ссылка на игровой профиль
  registed: { type: String, required: true }, // id сервера, где был зарегестрирован
  perms: { type: Number, defailt: 1 }, // Пока будет так. 1 - игрок
});

const GameUsers = model(`gameUsers`, gameUsersSchema);

export { GameUsers, IGameUsers };
