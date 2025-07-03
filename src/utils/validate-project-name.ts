// src/utils/validate-project-name.ts
import { existsSync } from 'node:fs'

export function validateProjectName(name: string): string | Error | undefined {
  if (!/^[\w-]+$/i.test(name)) {
    return new Error('Invalid characters: use only alphanumerics, dashes and underscores.')
  }

  if (name.length === 0) {
    return new Error('Name must not be empty.')
  }

  if (existsSync(name)) {
    return 'Directory already exists.'
  }

  return undefined
}

