import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

// **Vois ici l'épiphanie, le feu originel:**
const nextConfigs = compat.extends('next/core-web-vitals', 'next/typescript');

const config = [
  {
    ignores: ['vitest.setup.ts', 'node_modules/**', 'dist/**', '.next/**'],
  },
  ...nextConfigs,
  {
    files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn'],
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    files: ['*.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // règles JS
    },
  },
];

export default config;
