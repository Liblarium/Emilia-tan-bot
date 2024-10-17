import { customJsonb } from "@database";
import { localLevel } from "@schema/level.local";
import { relations } from "drizzle-orm";
import { bigint, boolean, pgTable } from "drizzle-orm/pg-core";

export type GuildLogsOptions = {
  id: string;
  bit_int: number;
}

const custmJsonb = (name: string) => customJsonb<GuildLogsOptions>(name).default({ id: "0", bit_int: 0 });

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

export interface GuildTable { //maybe edit this schema. to one intents
  id: bigint;
  prefix: { default: string, now: string };
  addInBD: boolean;
  logModule: boolean;
  levelModule: boolean;
  message: GuildLogsOptions;
  channel: GuildLogsOptions;
  guild: GuildLogsOptions;
  member: GuildLogsOptions;
  emoji: GuildLogsOptions;
  role: GuildLogsOptions;
}

export const guildRelations = relations(guild, ({ one }) => ({
  local_level: one(localLevel)
}));