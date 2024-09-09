import { customJsonb } from "@database/schema.custom.type";
import { localLevel } from "@schema/level.local";
import { relations } from "drizzle-orm";
import { bigint, boolean, pgTable } from "drizzle-orm/pg-core";

const custmJsonb = (name: string) => customJsonb<{ id: string, bit_int: number }>(name).default({ id: "0", bit_int: 0 });

export const guild = pgTable('guild', {
  id: bigint("id", { mode: "bigint" }).primaryKey(),
  prefix: customJsonb<{ default: string, now: string }>('prefix').default({ default: "++", now: "++" }),
  addInBD: boolean('addInBD').default(false),
  logModule: boolean("log_module").default(false),
  levelModule: boolean("level_module").default(false),
  message: custmJsonb("message"),
  channel: custmJsonb("channel"),
  guild: custmJsonb("guild"),
  member: custmJsonb("member"),
  emoji: custmJsonb("emoji"),
  role: custmJsonb("role")
});

export const guildRelations = relations(guild, ({ one }) => ({
  local_level: one(localLevel)
}));