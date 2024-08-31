import { bigint, pgTable } from "drizzle-orm/pg-core";

export const privateVoise = pgTable('private_voice', {
  id: bigint("id", { mode: "bigint" }).primaryKey(),
  ownerId: bigint("owner_id", { mode: "bigint" }).notNull(),
  guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
});
