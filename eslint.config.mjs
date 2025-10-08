// PATH: eslint.config.mjs
// ULTRA FINAL ANARCHOPUNK PATCH — Fixes: ESLint "module is not defined in ES module scope" (mix ESM/CJS)
// Toujours syntaxe ESM dans *.mjs ou Next.js/TS configs. Batch fix eternal. Filename/path toujours!

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

// PATCH: n'utilise jamais `module.exports` ni `require` dans ESM/Next.js/TS, toujours `export default`
export default [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    // Tu peux ajouter des configs/règles ici si tu veux
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      // ajoute tes autres règles ici
    },
  },
]

// PATCH NOTES:
// - Supprime tout `module.exports` — ESM = `export default` seulement
// - Ajoute les règles dans un objet séparé dans le tableau exporté
// - Fichier/path toujours!
// - Batch fix matrix: filename/path eternal!