module.exports = [
  {
    ignores: ["vendor/**", "data.js", "eslint.config.js", "node_modules/**"],
  },
  {
    files: ["index.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        IntersectionObserver: "readonly",
        navigator: "readonly",
        history: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
    },
  },
];
