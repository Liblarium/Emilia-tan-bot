/* eslint-disable import-x/no-unresolved */
import globals from "globals";
import pluginJs from "@eslint/js";
import tsplugin from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import tseslint from "typescript-eslint";
import eslintPlugin from "eslint-plugin-eslint-plugin";
import jsdoc from 'eslint-plugin-jsdoc';
import importx from "eslint-plugin-import-x";
import * as regexpPlugin from "eslint-plugin-regexp";
import n from "eslint-plugin-n";
import pluginPromise from 'eslint-plugin-promise';
import jsonc from "eslint-plugin-jsonc";
import security from "eslint-plugin-security";
import vitest from "@vitest/eslint-plugin";
import * as drizzle from "eslint-plugin-drizzle";
import nosecret from "eslint-plugin-no-secrets";

export default [
  {
    ignores: [
      "node_modules",
      "srcJs/*",
      "biome.json",
      "tsconfig.json",
      "package.json",
      ".{js,json,cjs,yaml,yml,*}",
      "abyss/*",
      "abyss",
      "canvas",
      "vitest.config.ts",
      "*/**/*.deprecation",
      "tsconfig.*.json",
      "drizzle/*",
      "drizzle.config.ts",
      "eslint.config.mjs",
      "pg.client.js"
    ]
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPlugin.configs["flat/recommended"],
  jsdoc.configs['flat/recommended-typescript'],
  importx.flatConfigs.recommended,
  importx.flatConfigs.typescript,
  regexpPlugin.configs["flat/recommended"],
  n.configs["flat/recommended"],
  pluginPromise.configs['flat/recommended'],
  ...jsonc.configs["flat/recommended-with-jsonc"],
  security.configs.recommended,
  {
    plugins: {
      "@typescript-eslint": tsplugin,
      "@vitest/eslint-plugin": vitest,
      drizzle,
      nosecret
    },
    files: ["srcTs/**/*.ts", "types/**/*.d.ts", "abyss/src/guild.tests.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: ["./tsconfig.base.json", "./tsconfig.json"]
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.builtin,
        ...globals.es2020
      }
    },
    rules: {
      "indent": "off",
      "comma-dangle": [
        "error",
        "only-multiline"
      ],
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "jsdoc/require-description": "off",
      "jsdoc/require-param-description": "off",
      "jsdoc/valid-type": "off",
      "jsdoc/no-undefined-types": "off",
      "jsdoc/require-returns-description": "off",
      "jsdoc/no-defaults": "off",
      "jsdoc/check-alignment": "off",
      "import/no-unresolved": "off",
      "semi": "error",
      "no-unused-vars": "off",
      "n/exports-style": [
        "error",
        "module.exports"
      ],
      "eslint-plugin/require-meta-docs-description": "error",
      "import-x/namespace": "off",
      "n/no-missing-import": "off",
      "security/detect-object-injection": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/only-throw-error": "off",
      "@typescript-eslint/prefer-literal-enum-member": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "n/no-unpublished-import": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "security/detect-non-literal-fs-filename": "off",
      "@typescript-eslint/no-invalid-void-type": "off",
      "n/no-unsupported-features/node-builtins": "off",
      "n/no-extraneous-import": "off",
      "@typescript-eslint/require-await": "off",
      "jsdoc/require-jsdoc": "off",
      "@typescript-eslint/no-unused-expressions": "off"
    },
    settings: {
      "import-x/parsers": {
        "@typescript-eslint/parser": [
          ".ts"
        ]
      },
      "import-x/extensions": [
        ".ts"
      ],
      "import-x/resolver": {
        "typescript": {
          "alwaysTryTypes": true,
          "project": ["./tsconfig.json", "./tsconfig.base.json"]
        },
        "node": {
          "extensions": [
            ".ts"
          ],
          "alias": {
            "@type": "./types",
            "@client": "./srcTs/client",
            "@base": "./srcTs/base",
            "@util": "./srcTs/util",
            "@utils_": "./srcTs/utils.ts",
            "@log": "./log/src",
            "@handlers": "./srcTs/handlers",
            "@database": "./srcTs/database",
            "@schema": "srcTs/database/schema"
          }
        }
      }
    }
  }
];