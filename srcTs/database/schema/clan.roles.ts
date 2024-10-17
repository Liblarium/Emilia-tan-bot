import { sql } from "drizzle-orm";
import { bigint, bigserial, integer, pgTable, text } from "drizzle-orm/pg-core";
import { clan } from "./clan.core";

export const clanRole = pgTable('clanRole', {
  id: bigserial('id', { mode: "bigint" }).primaryKey(),
  clanId: bigint("clan_id", { mode: "bigint" }).references(() => clan.id, { onDelete: "set default" }).default(sql`'0'::bigint`),
  name: text("name").notNull(),
  permission: integer("permission").notNull(),
});

export interface ClanRoleTable {
  id: bigint;
  clanId: bigint;
  name: string;
  permission: number;
}
