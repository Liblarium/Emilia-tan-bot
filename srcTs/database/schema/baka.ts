import { bigint, jsonb, pgTable, text } from "drizzle-orm/pg-core";
//import { customJsonb } from "../schema.custom.type";

export const baka = pgTable('baka', {
  id: bigint("id", { mode: "bigint" }).primaryKey(),
  uname: text("uname"),
  test: jsonb("test")
});
