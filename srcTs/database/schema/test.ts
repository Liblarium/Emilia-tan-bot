import { bigint, jsonb, pgTable } from "drizzle-orm/pg-core";
//import { customJsonb } from "@database/schema.custom.type";

export const test = pgTable('test', {
  id: bigint("id", { mode: "bigint" }).primaryKey(),
  codes: jsonb("codes")
});

