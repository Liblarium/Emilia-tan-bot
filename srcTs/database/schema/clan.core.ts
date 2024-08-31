import { relations } from 'drizzle-orm';
import { bigint, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { customJsonb } from "../schema.custom.type";
import { clanMember } from "./clan.members";
import { user } from "./user";


export const clan = pgTable('clan', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: text('type', { enum: ["clan", "guild", "cult", "sect"] }).notNull(),
  master: bigint('master', { mode: "bigint" }).notNull().references(() => user.id),
  positions: customJsonb<Record<string, { position: number }>>("positions").default({}),
  positionMax: integer("position_max").default(150),
  limit: integer('limit').default(50),
  deputuMax: integer('deputu_max').default(2),
});

export const clanRelation = relations(clan, ({ many }) => ({
  members: many(clanMember)
}));



// import { Column, Entity, PrimaryColumn } from "typeorm";
// import { IClans } from "../../../types/database/schema/clans";

// export const defaultClans: IClans[`info`] = {
//   name: "",
//   master: "",
//   deputu: {},
//   positions: {
//     "master": { position: 100 },
//     "elite": { position: 50 },
//     "member": { position: 1 },
//     "guest": { position: 0 }
//   },
//   limit: 50,
//   position_limit: 10,
//   elite_max: 5,
//   upgrade: {
//     count: 1,
//     max: 50
//   },
//   deputu_max: 2
// };

// @Entity({ name: "clans" })
// class Clans implements IClans {
//   @PrimaryColumn({ type: "bigint" })
//   id!: IClans[`id`];

//   @Column({ type: "text" })
//   type!: IClans[`type`];

//   @Column({ type: "jsonb", default: defaultClans })
//   info!: IClans[`info`];
// }

// export { Clans, IClans };
