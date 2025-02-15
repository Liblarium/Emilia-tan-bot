import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { offNewLine } from "../utils/formatters/offNewLine";

/**
 * @file postgres.ts
 * @description Manages the PostgreSQL cluster by stopping and starting it using `pg_ctl`.
 */

/**
 * Manages the PostgreSQL cluster by stopping and starting it using `pg_ctl`.
 * 
 * Assumes environment variables `DB_USER` and `DB_PASS` are set for authentication.
 * 
 * Logs the stdout and stderr data from the `pg_ctl` process.
 * 
 * Throws a `EmiliaTypeError` if required environment variables are not found.
 * 
 * Catches and logs any errors that occur during the process execution.
 */
function run_pg() {
  const pgdata_path = resolve("./pgdata");

  try {
    if (!process.env.DB_USER || !process.env.DB_PASS) throw TypeError("The specified data in .env file (DB_USER | DB_PASS) was not found!");

    spawn("pg_ctl", ["stop", "-D", pgdata_path, "-U", process.env.DB_USER, "-P", process.env.DB_PASS]);
    const pgStart = spawn("pg_ctl", ["start", "-D", pgdata_path, "-U", process.env.DB_USER, "-P", process.env.DB_PASS]);

    pgStart.stdout.on("data", (data) => console.info(`PG_SQL процесс dtdout: ${offNewLine(data)}`));

    pgStart.stderr.on("data", (data) => console.info(`PG_SQL процесс stderr: ${offNewLine(data)}`));

    pgStart.on("close", (code) => {
      return console.info(code === 0 ? "PostgreSQL process finished successfully." : `PostgreSQL process finished with code ${code}`);
    });
  } catch (e) {
    console.error(e);
  }
}

// Run the сluster management function
run_pg();