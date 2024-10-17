import { relations } from 'drizzle-orm';
import { bigint, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { clan } from "./clan.core";
import { clanMember } from './clan.members';
import { dostup } from "./dostup";
import { globalLevel } from "./level.global";
import { localLevel } from "./level.local";

export interface UsersTable {
  /** Идентификатор пользователя. */
  id: bigint;
  /** Имя пользователя */
  username: string;
  /** Права пользователя. */
  perms?: number;
  /** Описание (обо мне) пользователя. */
  bio?: string;
  /** 
   * Значение от `0` до `100`. 
   * 
   * Где `100` - повышение до `чтец`а. 
   * 
   * А значение ниже `0` - вы не можете быть `чтец`ом по `n` причине.
   * 
   * Ниже `-100` не может быть. 
   * 
   * @default 0
   * */
  potion?: number;
  /** Печенье пользователя. */
  pechenie?: number;
  /** Пол пользователя. */
  pol?: string;
  /** Идентификатор клана пользователя. */
  clanId?: bigint | null;
}

export const users = pgTable('users', {
  id: bigint('id', { mode: "bigint" }).primaryKey(),
  username: text('username').notNull(),
  perms: integer('perms').default(0),
  bio: text('bio').default('Вы можете изменить информацию о пользователе с помощью /newinfo'),
  potion: integer('potion').default(0), //от 0 до 100. Где 100 - повышение до чтеца. ниже -100 не может быть
  pechenie: integer('pechenie').default(0),
  pol: text('pol').default("неизвестно"),
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
