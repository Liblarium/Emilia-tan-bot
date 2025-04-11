import { build } from "esbuild";
import { glob } from "glob";
import { resolve } from "node:path";

const entryPoints = await glob("src/**/*.ts");

build({
  entryPoints,
  bundle: false, // all files not merged on bundle
  platform: "node",
  outfile: "dist/index.js",
  sourcemap: true,
  format: "esm",
  target: "esnext",
  tsconfig: "tsconfig.json",
  alias: {
    "@client/pg": resolve(__dirname, "src/client/postgres.ts"),
    "@client": resolve(__dirname, "src/client/index.ts"),
    "@constants/*": resolve(__dirname, "src/constants/*"),
    "@db/*": resolve(__dirname, "src/database/*"),
    "@utils/*": resolve(__dirname, "src/utils/*"),
    "@log": resolve(__dirname, "src/log/index.ts"),
    "@interaction/*": resolve(__dirname, "src/interaction/*"),
    "@handlers/*": resolve(__dirname, "src/handlers/*")
  }
}).then(() => console.log("Build succeeded!"))
  .catch((error) => {
    console.error("Build failed:", error);
    process.exit(1);
  });