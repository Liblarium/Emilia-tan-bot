import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const clanRole = pgTable('clanRole', {
  id: serial('id').primaryKey(),
  name: text("name").notNull(),
  permission: integer("permission").notNull(),
});


