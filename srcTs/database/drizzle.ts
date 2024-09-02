import { Log } from "@log";
import { sql } from 'drizzle-orm';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { schema } from "./schemas";

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL ?? `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}/${process.env.DB_NAME}?schema=public`
});

export const db = drizzle(pgPool, { schema });

//проверка наличия подключения к БД, так как тут pool
try {
  void db.execute(sql`SELECT 1`);
  new Log({ text: "Подключение к базе данных успешно установлено", type: "info", categories: ["global", "pg"] });
} catch (error) {
  new Log({ text: `Ошибка при подключении к базе данных: ${error}`, type: "error", categories: ["global", "pg"] });
}

db.query.users.findFirst();