export default {
  "*.{js,ts,tsx,mts,mjs}": [
    "pnpm biome check --apply",
    "pnpm eslint --fix",
    "pnpm prettier --write",
  ],
  "*.{json,md,yml,yaml}": ["pnpm prettier --write"],
};
