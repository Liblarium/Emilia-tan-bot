import { bigint, integer, pgTable } from "drizzle-orm/pg-core";

export const localLevel = pgTable("global_level", {
  id: bigint("id", { mode: "bigint" }).primaryKey(), //guildId
  userId: bigint("user_id", { mode: "bigint" }),
  xp: integer("xp"),
  level: integer("level"),
  maxXp: integer("max_xp").default(150),
  nextXp: bigint("next_xp", { mode: "bigint" })
});