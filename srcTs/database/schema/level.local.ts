import { bigint, bigserial, integer, pgTable } from "drizzle-orm/pg-core";

//изменить чуть позже, так как guildId не уникален
export const localLevel = pgTable("local_level", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  guildId: bigint("guild_id", { mode: "bigint" }),
  userId: bigint("user_id", { mode: "bigint" }),
  xp: integer("xp"),
  level: integer("level"),
  maxXp: integer("max_xp").default(150),
  nextXp: bigint("next_xp", { mode: "bigint" })
});