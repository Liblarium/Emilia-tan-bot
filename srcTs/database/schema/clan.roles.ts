import { bigint, bigserial, integer, pgTable, text } from "drizzle-orm/pg-core";
import { clan } from "./clan.core";

export const clanRole = pgTable('clanRole', {
  id: bigserial('id', { mode: "bigint" }).primaryKey(),
  clanId: bigint("clan_id", { mode: "bigint" }).references(() => clan.id),
  name: text("name").notNull(),
  permission: integer("permission").notNull(),
});


