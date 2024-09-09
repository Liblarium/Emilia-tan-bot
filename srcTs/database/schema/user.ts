import { relations } from 'drizzle-orm';
import { bigint, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { clan } from "./clan.core";
import { clanMember } from './clan.members';
import { dostup } from "./dostup";
import { globalLevel } from "./level.global";
import { localLevel } from "./level.local";

export const users = pgTable('users', {
  id: bigint('id', { mode: "bigint" }).primaryKey(),
  username: text('username').notNull(),
  perms: integer('perms').default(0),
  bio: text('bio').default('Вы можете изменить информацию о пользователе с помощью /newinfo'),
  potion: integer('potion').default(0), //от 0 до 100. Где 100 - повышение до чтеца. ниже -100 не может быть
  pechenie: integer('pechenie').default(0),
  localLevelId: bigint("local_level_id", { mode: "bigint" }).references(() => localLevel.id),
  clanId: bigint("clan_id", { mode: "bigint" })
});

export const userRelations = relations(users, ({ one, many }) => ({
  clan: one(clan, {
    fields: [users.clanId],
    references: [clan.id]
  }),
  clan_member: one(clanMember, {
    fields: [users.id],
    references: [clanMember.userId]
  }),
  dostup: one(dostup, {
    fields: [users.id],
    references: [dostup.id]
  }),
  global_level: one(globalLevel, {
    fields: [users.id],
    references: [globalLevel.id]
  }),
  local_level: many(localLevel),
}));
