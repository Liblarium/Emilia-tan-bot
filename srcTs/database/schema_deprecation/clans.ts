/* eslint-disable indent */
import { Column, Entity, PrimaryColumn } from "typeorm";
import { IClans } from "../../../types/database/schema/clans";

export const defaultClans: IClans[`info`] = {
  name: "",
  master: "",
  deputu: {},
  positions: {
    "master": { position: 100 },
    "elite": { position: 50 },
    "member": { position: 1 },
    "guest": { position: 0 }
  },
  limit: 50,
  position_limit: 10,
  elite_max: 5,
  upgrade: {
    count: 1,
    max: 50
  },
  deputu_max: 2
};

@Entity({ name: "clans" })
class Clans implements IClans {
  @PrimaryColumn({ type: "bigint" })
  id!: IClans[`id`];

  @Column({ type: "text" })
  type!: IClans[`type`];

  @Column({ type: "jsonb", default: defaultClans })
  info!: IClans[`info`];
}

export { Clans, IClans };
