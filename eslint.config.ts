import globals from "globals";
import pluginJs from "@eslint/js";
import tsparser from "@typescript-eslint/parser";
import tseslint from "typescript-eslint";
import biome from "eslint-config-biome";

export default [
  {
    ignores: [
      "node_modules",
      "dist/*",
      "biome.json",
      "tsconfig.json",
      "package.json",
      "package-lock.json",
      "esbuild.config.js",
      "jest.config.js",
      "*/**/*.deprecation",
      "tsconfig.*.json",
      "prisma/*",
      "eslint.config.ts",
      "oldCode",
      "dist",
      "sanbox/*",
      "__tests__/*",
      "types",
      "*/**/*.test.ts"
    ]
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  biome,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2025,
      globals: {
        ...globals.browser,
        ...globals.vitest,
        ...globals.node,
        ...globals.builtin,
        ...globals.es2025
      },
      parser: tsparser
    },
    rules: {
      "indent": "off",
      "comma-dangle": [
        "error",
        "only-multiline"
      ],
      "@typescript-eslint/no-explicit-any": "off", // You... you know what you are doing
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "import/no-unresolved": "off",
      "semi": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/only-throw-error": "off",
      "@typescript-eslint/prefer-literal-enum-member": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-invalid-void-type": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    }
  }
];
