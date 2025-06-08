export default {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react" // si tu utilises React, sinon retire cette ligne
  ],
  plugins: [
    // liste tes plugins nécessaires ici
    // ici on ajoute explicitement le plugin manquant pour éviter l'erreur :
    "babel-plugin-deprecated-import-assert"
  ]
};
module.exports = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      plugins: ["babel-plugin-deprecated-import-assert"],
    },
  },
  // ...le reste de ta config
};
