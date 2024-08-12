/* eslint-disable indent */
import { Column, Entity, PrimaryColumn } from "typeorm";
import { IBaka } from "../../../types/database/schema/baka";

@Entity({ name: "baka" })
class Baka implements IBaka {
  @PrimaryColumn({ type: "bigint" })
  id!: IBaka[`id`];

  @Column({ type: "text" })
  uname?: IBaka[`uname`];

  @Column({ type: "jsonb" })
  test?: IBaka[`test`];
}

export { Baka, IBaka };
