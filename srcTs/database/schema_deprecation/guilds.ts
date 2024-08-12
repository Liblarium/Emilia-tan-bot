/* eslint-disable indent */
import { Column, Entity, PrimaryColumn } from "typeorm";
import { IGuilds } from "../../../types/database/schema/guilds";

export const guildsLogDefault: IGuilds["logs"] = {
  log_module: false,
  message: {
    id: "0",
    update: false,
    delete: false,
  },
  channel: {
    id: "0",
    create: false,
    delete: false,
    update: false,
    join: false,
    leave: false,
  },
  guild: {
    id: "0",
    update: false,
  },
  member: {
    id: "0",
    update: false,
    join: false,
    leave: false,
  },
  emoji: {
    id: "0",
    update: false,
    create: false,
    delete: false,
  },
  role: {
    id: "0",
    create: false,
    update: false,
    delete: false,
  },
};

@Entity({ name: "guilds" })
class Guilds implements IGuilds {
  @PrimaryColumn({ type: "bigint" })
  id!: IGuilds["id"];

  @Column({ type: "jsonb", default: { default: "++", now: "++" } })
  prefix?: IGuilds["prefix"];

  @Column({ type: "boolean", default: false })
  addInBD?: IGuilds["addInBD"];

  @Column({ type: "jsonb", default: guildsLogDefault })
  logs?: IGuilds["logs"];
}

export { Guilds, IGuilds };
