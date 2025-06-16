import { cancel, group } from '@clack/prompts'
import * as process from 'node:process'
import { getPromptName } from './get-prompt-name'
import { getPromptTemplate } from './get-prompt-template'
export function getPrompts({ options }) {
  return group(
    {
      name: getPromptName({ options }),
      template: getPromptTemplate({ options }),
    },
    {
      onCancel: () => {
        cancel('Operation cancelled.')
        process.exit(1)
      },
    },
  )
}
