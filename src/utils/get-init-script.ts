import { existsSync, writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { z } from 'zod'

export const initScriptKey = 'create-solana-dapp'

const InitScriptSchema = z
  .object({
    instructions: z.array(z.string()).optional(),
    rename: z
      .record(
        z.object({
          to: z.string(),
          paths: z.array(z.string()),
        }),
      )
      .optional(),
    versions: z
      .object({
        anchor: z.string().optional(),
        solana: z.string().optional(),
      })
      .optional(),
  })
  .optional()

export type InitScript = z.infer<typeof InitScriptSchema>

export function getInitScript(targetDirectory: string): InitScript | undefined {
  const packageJson = join(targetDirectory, 'package.json')

  if (!existsSync(packageJson)) {
    throw new Error('No package.json found')
  }

  const raw = readFileSync(packageJson, 'utf-8')
  const contents = JSON.parse(raw)

  if (!contents) {
    throw new Error('Error loading package.json')
  }

  const init = contents[initScriptKey]

  if (!init) {
    return undefined
  }

  const parsed = InitScriptSchema.safeParse(init)

  if (!parsed.success) {
    throw new Error(`Invalid init script: ${parsed.error.message}`)
  }

  return parsed.data
}

export function deleteInitScript(targetDirectory: string): void {
  const packageJson = join(targetDirectory, 'package.json')

  if (!existsSync(packageJson)) {
    throw new Error('No package.json found')
  }

  const raw = readFileSync(packageJson, 'utf-8')
  const contents = JSON.parse(raw)

  delete contents[initScriptKey]

  writeFileSync(packageJson, JSON.stringify(contents, undefined, 2) + '\n')
}
