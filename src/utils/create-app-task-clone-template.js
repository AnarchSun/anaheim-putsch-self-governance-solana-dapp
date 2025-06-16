import { log } from '@clack/prompts'
import { downloadTemplate } from 'giget'
import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { taskFail } from './vendor/clack-tasks'
export function createAppTaskCloneTemplate(arguments_) {
  return {
    title: 'Cloning template',
    task: async (result) => {
      const exists = existsSync(arguments_.targetDirectory)
      if (exists) {
        taskFail(`Target directory ${arguments_.targetDirectory} already exists`)
      }
      if (!arguments_.template.repository) {
        taskFail('No template repository specified')
      }
      if (arguments_.verbose) {
        log.warn(`Cloning template ${arguments_.template.repository} to ${arguments_.targetDirectory}`)
      }
      try {
        const { dir } = await downloadTemplate(arguments_.template.repository, {
          dir: arguments_.targetDirectory,
        })
        // make sure the dir is not empty
        const files = await readdir(dir)
        if (files.length === 0) {
          taskFail(`The template directory is empty. Please check the repository: ${arguments_.template.repository}`)
          return
        }
        return result({ message: `Cloned template to ${dir}` })
      } catch (error) {
        taskFail(`init: Error cloning the template: ${error}`)
      }
    },
  }
}
