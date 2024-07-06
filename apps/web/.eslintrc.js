module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    browser: true,
  },
  parserOptions: { ecmaVersion: 8, sourceType: "module" },
  extends: ["eslint:recommended", "next"],
  settings: {
    react: { version: "detect" },
    "import/resolver": {
      typescript: {},
    },
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      extends: [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:prettier/recommended",
      ],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: ["@/features/*/*"],
          },
        ],
        "linebreak-style": ["error", "unix"],
        "import/order": [
          "error",
          {
            groups: [
              "builtin",
              "external",
              "internal",
              "parent",
              "sibling",
              "index",
              "object",
            ],
            "newlines-between": "always",
            alphabetize: { order: "asc", caseInsensitive: true },
          },
        ],
        "@typescript-eslint/no-unused-vars": ["error"],
        "no-empty-pattern": "off",
        "react/react-in-jsx-scope": "off",
        "import/no-named-as-default": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "prettier/prettier": ["error", {}, { usePrettierrc: true }],
      },
    },
    {
      files: ["*.test.ts", "*.test.tsx"],
      extends: ["plugin:testing-library/react"],
    },
    {
      files: ["*.e2e.ts"],
      extends: ["plugin:playwright/recommended"],
    },
  ],
}
