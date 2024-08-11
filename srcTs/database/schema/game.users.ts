/* eslint-disable indent */
import { Column, Entity, PrimaryColumn } from "typeorm";
import { IGameUsers } from "../../../types/database/schema/game.users";

@Entity({ name: "gameUsers" })
class GameUsers implements IGameUsers {
  @PrimaryColumn({ type: "bigint" })
  id!: IGameUsers[`id`];

  @Column({ type: "text" })
  username!: IGameUsers[`username`];

  @Column({ type: "text" })
  created!: IGameUsers[`created`];

  @Column({ type: "bigint" })
  profile!: IGameUsers[`profile`];

  @Column({ type: "text" })
  registed!: IGameUsers[`registed`];

  @Column({ type: "int", default: 1 })
  perms!: IGameUsers[`perms`];
}

export { GameUsers, IGameUsers };
