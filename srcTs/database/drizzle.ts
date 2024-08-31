import { Log } from "@log";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pgClient = new Pool({
  connectionString: process.env.DATABASE_URL ?? `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}/${process.env.DB_NAME}?schema=public`
});

void pgClient.connect();

pgClient.on("connect", () => {
  new Log({ text: "PG connecting!", type: "info", categories: ["global", "pg"] });
});

pgClient.on('error', (err) => {
  new Log({ text: err, type: "error", categories: ["global", "pg"] });
});

export const db = drizzle(pgClient);
