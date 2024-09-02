import { bigint, integer, pgTable } from "drizzle-orm/pg-core";

export const globalLevel = pgTable("global_level", {
  id: bigint("id", { mode: "bigint" }).primaryKey(), //userId
  xp: integer("xp").default(0),
  level: integer("level").default(0),
  maxXp: integer("max_xp").default(150),
  nextXp: bigint("next_xp", { mode: "bigint" })
});

