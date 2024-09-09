import { customJsonb } from "@database/schema.custom.type";
import { relations } from "drizzle-orm";
import { bigint, bigserial, pgTable, uuid } from "drizzle-orm/pg-core";
import { clan } from "./clan.core";
import { clanRole } from "./clan.roles";
import { users } from "./user";

export const clanMember = pgTable("clanMember", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  userId: bigint("user_id", { mode: "bigint" }).references(() => users.id),
  clanId: bigint("clan_id", { mode: "bigint" }).references(() => clan.id),
  roleId: bigint("role_id", { mode: "bigint" }).references(() => clanRole.id),
  atribytes: customJsonb<{
    owner: boolean;
    elite: boolean;
    deputu: boolean;
  }>("atribytes"),
});

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
