import { isCancel, log, select } from '@clack/prompts'
import { frameworks } from '../templates/frameworks'
import { getTemplatesForFramework } from '../templates/templates'
export function getPromptTemplate({ options }) {
  return async () => {
    if (options.template) {
      log.success(`Template: ${options.template.description}`)
      return options.template
    }
    const framework = await selectFramework(frameworks)
    if (isCancel(framework)) {
      throw 'No framework selected'
    }
    return selectTemplate(getTemplatesForFramework(framework))
  }
}
function getFrameworkSelectOptions(values) {
  return {
    message: 'Select a framework',
    options: values.map((value) => ({
      label: value.name,
      value,
      hint: value.description ?? '',
    })),
  }
}
function selectFramework(values) {
  return select(getFrameworkSelectOptions(values))
}
function getTemplateSelectOptions(values) {
  return {
    message: 'Select a template',
    options: values.map((value) => ({
      label: value.name,
      value,
      hint: value.description ?? '',
    })),
  }
}
function selectTemplate(values) {
  return select(getTemplateSelectOptions(values))
}
