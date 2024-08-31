import { defineConfig } from "drizzle-kit";
import 'dotenv/config';

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}/${process.env.DB_NAME}?schema=public`
  },
  out: "./drizzle",
  schema: "./srcTs/database/schema/*",
  migrations: {
    table: "drizzle_migration_profile",
    schema: "public",
  }
});