import { bigint, jsonb, pgTable } from "drizzle-orm/pg-core";
//import { customJsonb } from "../schema.custom.type";

export const test = pgTable('test', {
  id: bigint("id", { mode: "bigint" }).primaryKey(),
  codes: jsonb("codes")
});

