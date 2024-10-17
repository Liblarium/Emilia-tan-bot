import { customJsonb } from "@database";
import { relations, sql } from "drizzle-orm";
import { bigint, bigserial, pgTable, uuid } from "drizzle-orm/pg-core";
import { clan } from "./clan.core";
import { clanRole } from "./clan.roles";
import { users } from "./user";

export const clanMember = pgTable("clanMember", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  userId: bigint("user_id", { mode: "bigint" }).references(() => users.id, { onDelete: "set default" }).default(sql`'0'::bigint`),
  clanId: bigint("clan_id", { mode: "bigint" }).references(() => clan.id, { onDelete: "set default" }).default(sql`'0'::bigint`),
  roleId: bigint("role_id", { mode: "bigint" }).references(() => clanRole.id),
  attributes: customJsonb<{
    owner: boolean;
    elite: boolean;
    deputu: boolean;
  }>("attributes"),
});

export interface ClanMemberAttributes {
  owner: boolean;
  elite: boolean;
  deputu: boolean;
}

export interface ClanMemberTable {
  id: bigint;
  userId: bigint;
  clanId: bigint;
  roleId: bigint;
  attributes: ClanMemberAttributes;
}

export const clanRelation = relations(clanMember, ({ one, many }) => ({
  clan: one(clan, {
    fields: [clanMember.clanId],
    references: [clan.id]
  }),
  role: one(clanRole, {
    fields: [clanMember.roleId],
    references: [clanRole.id]
  }),
  user: many(users),
  deputu: many(users)
}));
