import { guild } from "@schema/guild";
import { users } from "@schema/user";
import { relations, sql } from "drizzle-orm";
import { bigint, bigserial, integer, pgTable } from "drizzle-orm/pg-core";

export const localLevel = pgTable("local_level", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  guildId: bigint("guild_id", { mode: "bigint" }),
  userId: bigint("user_id", { mode: "bigint" }),
  xp: integer("xp").default(0),
  level: integer("level").default(0),
  maxXp: integer("max_xp").default(150),
  nextXp: bigint("next_xp", { mode: "bigint" }).default(sql`CAST(EXTRACT(EPOCH FROM (NOW() + INTERVAL '30 seconds')) * 1000 AS BIGINT)`)
});



export const localLevelRelations = relations(localLevel, ({ one }) => ({
  user: one(users, {
    fields: [localLevel.userId],
    references: [users.id]
  }),
  guild: one(guild, {
    fields: [localLevel.guildId],
    references: [guild.id]
  })
}));