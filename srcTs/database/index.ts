import { Log } from "@log";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { schema } from "./schemas";

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL ?? `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}/${process.env.DB_NAME}?schema=public`
});

new Log({ text: "Подключение к базе данных успешно установлено", type: "info", categories: ["global", "pg"] });

export const db = drizzle(pgPool, { schema });
