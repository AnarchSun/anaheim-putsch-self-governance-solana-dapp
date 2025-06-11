const eslintConfig = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      plugins: ["babel-plugin-deprecated-import-assert"],
    },
  },
  // autres règles ESLint ici...
};

export default eslintConfig;
