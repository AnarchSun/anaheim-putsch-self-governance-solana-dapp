import { cancel, log, note, outro } from '@clack/prompts'
import * as process from 'node:process'
import { createApp } from './utils/create-app'
import { finalNote } from './utils/final-note'
import { getAppInfo } from './utils/get-app-info'
import { getArgs } from './utils/get-args'
import { detectInvokedPackageManager } from './utils/vendor/package-manager'


export async function main(argv: string[]) {
  // Detect package manager invoked
  const pm = detectInvokedPackageManager()

  // Extract app info from package.json
  const app = getAppInfo()

  try {
    // Gather CLI args and prompts
    const args = await getArgs(argv, app, pm)

    if (args.dryRun) {
      note(JSON.stringify(args, null, 2), 'Arguments')
      outro('🚀 Dry run was used, no changes were made')
      return
    }

    if (args.verbose) {
      log.warn(`Verbose output enabled`)
      console.warn(args)
    }

    // Orchestrate the sacred creation
    const instructions = await createApp(args)

    note(
      finalNote({
        ...args,
        target: args.targetDirectory.replace(process.cwd(), '.'),
        instructions,
      }),
      'Installation successful',
    )

    outro('Good luck with your project!')
  } catch (error) {
    cancel(String(error))
    process.exit(1)
  }
}
