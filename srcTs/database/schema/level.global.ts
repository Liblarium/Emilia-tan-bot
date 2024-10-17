import type { Level } from "@type/database/schema";
import { relations, sql } from "drizzle-orm";
import { bigint, integer, pgTable } from "drizzle-orm/pg-core";
import { users } from "./user";

export const globalLevel = pgTable("global_level", {
  id: bigint("id", { mode: "bigint" }).primaryKey(), //userId
  xp: integer("xp").default(0),
  level: integer("level").default(0),
  maxXp: integer("max_xp").default(150),
  nextXp: bigint("next_xp", { mode: "bigint" }).default(sql`CAST(EXTRACT(EPOCH FROM (NOW() + INTERVAL '30 seconds')) * 1000 AS BIGINT)`)
});

export interface GlobalLevelTable extends Level {
  id: bigint;
}

export const globalLevelRelations = relations(globalLevel, ({ one }) => ({
  user: one(users)
}));