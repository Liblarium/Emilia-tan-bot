import { relations } from 'drizzle-orm';
import { bigint, integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { customJsonb } from '../schema.custom.type';
import { clanRole } from "./clan.roles";
import { user } from "./user";

interface AtributesClanMember {
  owner: boolean;
  elite: boolean;
  deputu: boolean;
}

export const clanMember = pgTable('clanMember', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: bigint("user_id", { mode: "bigint" }).references(() => user.id),
  perms: integer("perms").references(() => clanRole.id),
  atribytes: customJsonb<AtributesClanMember>("atribytes"),
});

export const clanRelation = relations(clanMember, ({ many }) => ({
  users: many(user),
  deputu: many(user)
}));
