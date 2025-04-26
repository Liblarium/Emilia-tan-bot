export default {
  "*/*/src/**/*.{js,ts,tsx,mts,mjs}": [
    "pnpm biome check --write || echo 'No files to format.'",
    "pnpm eslint --fix || echo 'No files to format.'",
    "pnpm prettier --write || echo 'No files to format.'",
  ],
};
