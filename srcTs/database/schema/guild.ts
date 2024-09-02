import { customJsonb } from "@database/schema.custom.type";
import { bigint, boolean, pgTable } from "drizzle-orm/pg-core";

const defaultJsonb = { id: "0", bit_int: 0 };

export const guild = pgTable('guild', {
  id: bigint("id", { mode: "bigint" }).primaryKey(),
  prefix: customJsonb<{ default: string, now: string }>('prefix').default({ default: "++", now: "++" }),
  addInBD: boolean('addInBD').default(false),
  logModule: boolean("log_module").default(false),
  message: customJsonb<{ id: string, bit_int: number }>("message").default(defaultJsonb),
  channel: customJsonb<{ id: string, bit_int: number }>("channel").default(defaultJsonb),
  guild: customJsonb<{ id: string, bit_int: number }>("guild").default(defaultJsonb),
  member: customJsonb<{ id: string, bit_int: number }>("member").default(defaultJsonb),
  emoji: customJsonb<{ id: string, bit_int: number }>("emoji").default(defaultJsonb),
  role: customJsonb<{ id: string, bit_int: number }>("role").default(defaultJsonb)
});
