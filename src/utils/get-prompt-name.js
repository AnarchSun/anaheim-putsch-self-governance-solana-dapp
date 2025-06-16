import { log, text } from '@clack/prompts'
import { validateProjectName } from './validate-project-name'
export function getPromptName({ options }) {
  return () => {
    if (options.name) {
      log.success(`Project name: ${options.name}`)
      return Promise.resolve(options.name)
    }
    return text({
      message: 'Enter project name',
      validate: validateProjectName,
    })
  }
}
