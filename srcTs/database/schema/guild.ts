import { bigint, boolean, pgTable } from "drizzle-orm/pg-core";
import { customJsonb } from "../schema.custom.type";

interface JsonbLogConfig { id: string, bit_int: number }
const defaultJsonb = { id: "0", bit_int: 0 };

export const guild = pgTable('guild', {
  id: bigint("id", { mode: "bigint" }).primaryKey(),
  prefix: customJsonb<{ default: string, now: string }>('prefix').default({ default: "++", now: "++" }),
  addInBD: boolean('addInBD').default(false),
  logModule: boolean("log_module").default(false),
  message: customJsonb<JsonbLogConfig>("message").default(defaultJsonb),
  channel: customJsonb<JsonbLogConfig>("channel").default(defaultJsonb),
  guild: customJsonb<JsonbLogConfig>("guild").default(defaultJsonb),
  member: customJsonb<JsonbLogConfig>("member").default(defaultJsonb),
  emoji: customJsonb<JsonbLogConfig>("emoji").default(defaultJsonb),
  role: customJsonb<JsonbLogConfig>("role").default(defaultJsonb)
});
