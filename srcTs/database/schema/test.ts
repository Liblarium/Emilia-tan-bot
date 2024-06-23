import { Entity, Column, PrimaryColumn } from "typeorm";
import { ITest } from "../../../types/database/schema/test";

@Entity({ name: `test` })
class Test implements ITest {
  @PrimaryColumn({ type: `bigint` })
    id!: ITest[`id`];

  @Column({ type: `jsonb` })
    codes!: ITest[`codes`];
}
export { Test, ITest };
