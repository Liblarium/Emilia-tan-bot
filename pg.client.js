/* eslint @typescript-eslint/no-var-requires: "off" */
const { spawn } = require("node:child_process");
const { resolve } = require("node:path");
require("dotenv").config();
const time = () => {
  const t = {
    hour: new Date().getHours().toString().padStart(2, "0"),
    minute: new Date().getMinutes().toString().padStart(2, "0"),
    second: new Date().getSeconds().toString().padStart(2, "0"),
  };
  return `${t.hour}:${t.minute}:${t.second}`;
};

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

const pgdata_path = resolve("./pgdata");

if (!process.env.DB_USER || !process.env.DB_PASS) throw new TypeError("The specified data in .env file (DB_USER | DB_PASS) was not found!");

spawn("pg_ctl", ["stop", "-D", pgdata_path, "-U", process.env.DB_USER, "-P", process.env.DB_PASS]);
const pgStart = spawn("pg_ctl", ["start", "-D", pgdata_path, "-U", process.env.DB_USER, "-P", process.env.DB_PASS]);

pgStart.stdout.on("data", (data) => console.log(`[${time()}]: PG_SQL процесс dtdout: ${offNewLine(data)}`));

pgStart.stderr.on("data", (data) => console.log(`[${time()}]: PG_SQL процесс stderr: ${offNewLine(data)}`));

pgStart.on("close", (code) => {
  if (code === 0) console.log("[${time()}]: PG_SQL процесс завершил свою работу.");
  else console.error("[${time()}]: PG_SQL словил ошибку.");
});
