import { bigint, pgTable } from "drizzle-orm/pg-core";

export const privateVoice = pgTable('private_voice', {
  id: bigint("id", { mode: "bigint" }).primaryKey(),
  ownerId: bigint("owner_id", { mode: "bigint" }).notNull(),
  guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
});

export interface PrivateVoiceTable {
  id: bigint;
  ownerId: bigint;
  guildId: bigint;
}