try {
  require("dotenv").config();
  require("./srcJs/aliases");
  const { spawn } = require("node:child_process");
  const { resolve } = require("node:path");
  const { Log } = require("./srcJs/log");

  /**
   * Функция для убирания переноса строки
   * @param {string} text входящий текст
   * @returns {string} исходящий текст без переносов
   */
  const offNewLine = (text) => {
    const newLinePattern = /\r?\n$/;
    const line = text.toString();

    if (line.endsWith("\n") || newLinePattern.test(line)) return line.slice(0, -2);

    return line;
  };

  const categories = ["cluster"];
  const pgdata_path = resolve("./pgdata");

  if (!process.env.DB_USER || !process.env.DB_PASS) throw new TypeError("The specified data in .env file (DB_USER | DB_PASS) was not found!");

  spawn("pg_ctl", ["stop", "-D", pgdata_path, "-U", process.env.DB_USER, "-P", process.env.DB_PASS]);
  const pgStart = spawn("pg_ctl", ["start", "-D", pgdata_path, "-U", process.env.DB_USER, "-P", process.env.DB_PASS]);

  pgStart.stdout.on("data", (data) => new Log({ text: `PG_SQL процесс dtdout: ${offNewLine(data)}`, type: "info", categories }));

  pgStart.stderr.on("data", (data) => new Log({ text: `PG_SQL процесс stderr: ${offNewLine(data)}`, type: "error", categories }));

  pgStart.on("close", (code) => {
    return code === 0 ? new Log({ text: "[${time()}]: PG_SQL процесс завершил свою работу.", type: "info", categories }) : new Log({ text: "[${time()}]: PG_SQL словил ошибку.", type: "error", categories });
  });
} catch {
  console.error("Bruh, run tsc in terminal and try again!");
}