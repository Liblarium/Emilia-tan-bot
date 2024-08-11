/* eslint-disable indent */
import { Column, Entity, PrimaryColumn } from "typeorm";
import { IUsers } from "../../../types/database/schema/users";

export const defaultUsers: IUsers["info"] = {
  username: "",
  dostup: {
    base: "Гость",
    reader: "F",
    additional_access: [],
    max_rank: 9 // 9 == D-5
  },
  dn: 0,
  pol: "Не выбран",
  perms: 0,
  tityl: [],
  bio: "Вы можете изменить **Информация о пользователе** с помощью **/newinfo**",
  potion: 0,
  level: {
    global: {
      xp: 0, //опыт
      level: 0, //уровень
      max_xp: 300, //сколько до следующего уровня. Пока 300.
      next_xp: (new Date().getTime() + 10 * 60 * 1000).toString(),
    },
    local: {}
  },
  pechenie: 0,
  clan: 0
};

@Entity()
class Users implements IUsers {
  @PrimaryColumn({ type: "bigint" })
  id!: IUsers["id"];

  @Column({ type: "jsonb", nullable: true, default: defaultUsers })
  info?: IUsers["info"];
}

export { Users, IUsers };
