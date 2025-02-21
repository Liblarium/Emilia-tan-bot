import globals from "globals";
import pluginJs from "@eslint/js";
import tsplugin from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "node_modules",
      "dist/*",
      "biome.json",
      "tsconfig.json",
      "package.json",
      "jest.config.js",
      "*/**/*.deprecation",
      "tsconfig.*.json",
      "prisma/*",
      "eslint.config.mjs",
      "oldCode",
      "dist",
      "sanbox/*",
      "__tests__/*",
      "types"
    ]
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@typescript-eslint": tsplugin,
    },
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: ["./tsconfig.base.json", "./tsconfig.json"]
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.builtin,
        ...globals.es2025
      }
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
