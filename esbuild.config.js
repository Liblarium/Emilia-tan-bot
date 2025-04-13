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
    "@type": resolve(__dirname, "types"),
    "@client/pg": resolve(__dirname, "src/modules/client/postgres.ts"),
    "@client": resolve(__dirname, "src/modules/client/index.ts"),
    "@constants/*": resolve(__dirname, "src/modules/constants/*"),
    "@db/*": resolve(__dirname, "src/modules/database/*"),
    "@utils/*": resolve(__dirname, "src/utils/*"),
    "@log": resolve(__dirname, "src/modules/log/index.ts"),
    "@log/*": resolve(__dirname, "src/modules/log/*"),
    "@interaction/*": resolve(__dirname, "src/modules/interaction/*"),
    "@handlers/*": resolve(__dirname, "src/modules/handlers/*"),
    "@core/*": resolve(__dirname, "src/core/*"),
    "@command/*": resolve(__dirname, "src/command/*")
  }
}).then(() => console.log("Build succeeded!"))
  .catch((error) => {
    console.error("Build failed:", error);
    process.exit(1);
  });