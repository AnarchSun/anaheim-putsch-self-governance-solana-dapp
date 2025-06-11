const eslintConfig = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      plugins: ["babel-plugin-deprecated-import-assert"],
    },
  },
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  plugins: ["react"],
  rules: {
    '@next/next/no-img-element': 'off',
    // ajoute ici tes autres règles personnalisées...
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};

export default eslintConfig;
