#!/usr/bin/env tsx
import { prompt } from 'enquirer'
import { execSync } from 'node:child_process'

type PromptResult = {
  action: 'start' | 'build' | 'quit'
}

async function main() {
  const { action } = await prompt<PromptResult>({
    type: 'select',
    name: 'action',
    message: 'Choisis une action',
    choices: ['start', 'build', 'quit'],
  })

  console.log(`Tu as choisi : ${action}`)

  if (action === 'start') {
    execSync('pnpm dev', { stdio: 'inherit' })
  } else if (action === 'build') {
    execSync('pnpm build', { stdio: 'inherit' })
  } else {
    console.log('À bientôt, camarade anarcho-développeur.')
    process.exit(0)
  }
}

// Appel principal
main().then(() => {
  // Rien à faire ici si tout est géré dans `main`
}).catch(err => {
  console.error('Erreur fatale :', err)
  process.exit(1)
})
