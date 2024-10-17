import { customJsonb } from "@database";
import { relations } from "drizzle-orm";
import { bigint, integer, pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./user";

export const dostup = pgTable('dostup', {
  id: bigint('id', { mode: "bigint" }).primaryKey(), //use user.id form user
  base: text('base').default('Гость').notNull(),
  reader: text('reader').default('F').notNull(),
  additionalAccess: customJsonb<string[]>('additional_access').default([]),
  maxRank: integer('max_rank').default(9), //0 - infinite, 9 - D5
});

export interface DostupTable {
  id: bigint;
  base: string;
  reader: string;
  additionalAccess: string[] | [];
  maxRank: number;
}

export const dostupRelations = relations(dostup, ({ one }) => ({
  user: one(users)
}));