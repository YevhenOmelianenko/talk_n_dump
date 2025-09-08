// ESLint flat config for ESLint v9+
// Uses TypeScript support via typescript-eslint and disables stylistic rules in favor of Prettier

const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const prettier = require("eslint-config-prettier");

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  // Ignore build artifacts and config files
  { ignores: ["dist/**", "node_modules/**", "eslint.config.cjs", ".eslintrc.cjs", ".eslintignore"] },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Project rules
  {
    files: ["**/*.{ts,js}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      // Prefer TS rule for unused vars
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      // Do not block on any in this project
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Turn off stylistic rules that conflict with Prettier
  prettier,
];


