import { relations } from 'drizzle-orm';
import { bigint, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { clan } from "./clan.core";
import { dostup } from "./dostup";
import { globalLevel } from "./level.global";
import { localLevel } from "./level.local";

export const users = pgTable('users', {
  id: bigint('id', { mode: "bigint" }).primaryKey(),
  username: text('username').notNull(),
  dostup: bigint('dostup', { mode: "bigint" }).notNull().references(() => dostup.id),
  perms: integer('perms').default(0),
  bio: text('bio').default('Вы можете изменить информацию о пользователе с помощью /newinfo'),
  potion: integer('potion').default(0), //от 0 до 100. Где 100 - повышение до чтеца. ниже -100 не может быть
  pechenie: integer('pechenie').default(0),
  globalLevel: bigint("global_level", { mode: "bigint" }).notNull().references(() => globalLevel.id),
  localLevel: bigint("local_level", { mode: "bigint" }).references(() => localLevel.id),
  clanId: bigint("clan", { mode: "bigint" })
});

export const userRelations = relations(users, ({ one }) => ({
  clan: one(clan, {
    fields: [users.clanId],
    references: [clan.id]
  })
}));
