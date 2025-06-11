import { log } from '@clack/prompts'
import { downloadTemplate } from 'giget'
import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { GetArgsResult } from './get-args-result'
import { Task, taskFail } from './vendor/clack-tasks'

export async function createAppTaskCloneTemplate(args: GetArgsResult): Promise<Task> {
  return {
    title: 'Cloning template',
    task: async (result) => {
      if (args.verbose) {
        log.warn(`🔍 Checking if directory exists: ${args.targetDirectory}`)
      }

      const exists = existsSync(args.targetDirectory)
      if (exists) {
        taskFail(`❌ Target directory ${args.targetDirectory} already exists`)
      }

      if (!args.template.repository) {
        taskFail('❌ No template repository specified')
      }

      if (args.verbose) {
        log.warn(`📦 Cloning template ${args.template.repository} into ${args.targetDirectory}`)
      }

      try {
        const { dir } = await downloadTemplate(args.template.repository, {
          dir: args.targetDirectory,
        })

        const files = await readdir(dir)
        if (files.length === 0) {
          taskFail(`⚠️ The template directory is empty. Check: ${args.template.repository}`)
          return
        }

        return result({
          message: `✅ Cloned template to ${dir}`,
        })
      } catch (error) {
        taskFail(`💥 Error cloning the template: ${error}`)
      }
    },
  }
}
