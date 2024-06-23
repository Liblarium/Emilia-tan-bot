import { Entity, Column, PrimaryColumn } from "typeorm";
import { IGameRace } from "../../../types/database/schema/game.race";

@Entity({ name: `gameRace` })
class GameRace implements IGameRace {
  @PrimaryColumn({ type: `bigint` })
    id!: IGameRace[`id`];
  
  @Column({ type: `text` })
    name!: IGameRace[`name`];

  @Column({ type: `jsonb` })
    characteristic!: IGameRace[`characteristic`];
}

export { GameRace, IGameRace };
