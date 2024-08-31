import { bigint, integer, pgTable } from "drizzle-orm/pg-core";

export const globalLevel = pgTable("global_level", {
  id: bigint("id", { mode: "bigint" }).primaryKey(), //userId
  xp: integer("xp"),
  level: integer("level"),
  maxXp: integer("max_xp").default(150),
  nextXp: bigint("next_xp", { mode: "bigint" })
});

