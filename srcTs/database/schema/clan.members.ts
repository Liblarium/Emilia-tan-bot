import { customJsonb } from "@database/schema.custom.type";
import { relations } from "drizzle-orm";
import { bigint, integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { clanRole } from "./clan.roles";
import { users } from "./user";

export const clanMember = pgTable("clanMember", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: bigint("user_id", { mode: "bigint" }).references(() => users.id),
  perms: integer("perms").references(() => clanRole.id),
  atribytes: customJsonb<{
    owner: boolean;
    elite: boolean;
    deputu: boolean;
  }>("atribytes"),
});

export const clanRelation = relations(clanMember, ({ many }) => ({
  users: many(users),
  deputu: many(users),
}));
