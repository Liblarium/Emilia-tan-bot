import pluginJs from "@eslint/js";
import tsparser from "@typescript-eslint/parser";
import biome from "eslint-config-biome";
import prettier from "eslint-config-prettier/flat";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import nx from "@nx/eslint";
import globals from "globals";

export default [
  {
    ignores: [
      "node_modules",
      "apps/*/node_modules",
      "packages/*/node_modules",
      "dist/*",
      "*/**/dist/*",
      "biome.json",
      "tsconfig.json",
      "*/**/tsconfig.json",
      "package.json",
      "*/**/package.json",
      "pnpm-lock.yaml",
      ".swcrc",
      "*/**/*.deprecation",
      "tsconfig.*.json",
      "*/**/prisma/*",
      "eslint.config.ts",
      "oldCode",
      "sandbox/*",
      "*.t.*",
      "*/**/__tests__/*",
      "*/**/types",
      "*/**/*.test.ts",
    ],
  },
  pluginJs.configs.recommended,
  prettierPlugin,
  prettier,
  biome,
  {
    files: ["apps/**/src/**/*.ts", "packages/**/src/**/*.ts", "packages/**/src/**/*.d.ts", "*/src/**/*.ts", "*/src/**/*.d.ts"],
    languageOptions: {
      ecmaVersion: 2025,
      globals: {
        ...globals.browser,
        ...globals.vitest,
        ...globals.node,
        ...globals.builtin,
        ...globals.es2025,
        "NodeJS": true,
      },
      parser: tsparser,
    },
    rules: {
      indent: "off",
      "prettier/prettier": ["error", {
        "semi": true,
        "singleQuote": false,
        "trailingComma": "es5",
        "bracketSpacing": true,
        "arrowParens": "always",
        "useTabs": false,
        "tabWidth": 2,
        "printWidth": 100,
        "endOfLine": "auto",
        "quoteProps": "as-needed"
      }],
      "comma-dangle": ["error", "only-multiline"],
      "@typescript-eslint/no-explicit-any": "off", // You... you know what you are doing
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "import/no-unresolved": "off",
      semi: "error",
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
