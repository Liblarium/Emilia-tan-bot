import { IBaka } from "../../../types/database/schema/baka";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: `baka` })
class Baka implements IBaka {
  @PrimaryColumn({ type: `bigint` })
    id!: IBaka[`id`];

  @Column({ type: `text` })
    uname?: IBaka[`uname`];
  
  @Column({ type: `jsonb` })
    test?: IBaka[`test`];
}

export { Baka, IBaka };
