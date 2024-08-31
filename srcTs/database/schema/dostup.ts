import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { customJsonb } from "../schema.custom.type";


export const dostup = pgTable('dostup', {
  id: uuid('id').primaryKey(), //use user.id form user
  base: text('base').default('Гость').notNull(),
  reader: text('reader').default('F').notNull(),
  additionalAccess: customJsonb<string[]>('additional_access').default([]),
  maxRank: integer('max_rank').default(9), //0 - infinite, 9 - D5
});
