import { bigserial, integer, pgTable, text } from "drizzle-orm/pg-core";

export const clanRole = pgTable('clanRole', {
  id: bigserial('id', { mode: "number" }).primaryKey(),
  name: text("name").notNull(),
  permission: integer("permission").notNull(),
});


