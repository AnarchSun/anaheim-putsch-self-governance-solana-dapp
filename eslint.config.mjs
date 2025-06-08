import reactPlugin from 'eslint-plugin-react';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import babelParser from '@babel/eslint-parser';

export default [
  // Pour fichiers JS/JSX modernes
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 2024,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // React 17+ ne nécessite plus l'import explicite de React
    },
    settings: {
      react: {
        version: 'detect', // détecte automatiquement la version de React installée
      },
    },
  },

  // Pour fichiers TS/TSX
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json', // Assure que le tsconfig est bien présent à la racine
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error'],
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Ignorer les dossiers compilés et dépendances
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'tmp/**'],
  },
];
