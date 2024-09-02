import { customJsonb } from "@database/schema.custom.type";
import { relations } from 'drizzle-orm';
import { bigint, bigserial, integer, pgTable, text } from "drizzle-orm/pg-core";
import { clanMember } from "./clan.members";
import { users } from "./user";


export const clan = pgTable('clan', {
  id: bigserial('id', { mode: "bigint" }).primaryKey(),
  type: text('type', { enum: ["clan", "guild", "cult", "sect"] }).notNull(),
  master: bigint('master', { mode: "bigint" }).notNull().references(() => users.id),
  positions: customJsonb<Record<string, { position: number }>>("positions").default({}),
  positionMax: integer("position_max").default(150),
  limit: integer('limit').default(50),
  deputuMax: integer('deputu_max').default(2),
});

export const clanRelation = relations(clan, ({ many }) => ({
  members: many(clanMember)
}));
