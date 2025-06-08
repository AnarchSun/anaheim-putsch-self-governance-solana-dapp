import { log } from '@clack/prompts';
import { frameworks } from './frameworks';
export const templates = getTemplatesForFrameworks(frameworks);
export function findTemplate(name) {
    // A template name with a `/` is considered external
    if (name.includes('/')) {
        return {
            name,
            description: `${name} (external)`,
            repository: name.includes(':') ? name : `gh:${name}`,
        };
    }
    const template = templates.find((template) => template.name === name);
    if (!template) {
        throw new Error(`Template ${name} not found`);
    }
    return template;
}
function getTemplatesForFrameworks(frameworks = []) {
    return frameworks.reduce((accumulator, item) => {
        return [...accumulator, ...getTemplatesForFramework(item)];
    }, []);
}
export function getTemplatesForFramework(framework) {
    return framework.templates;
}
export function listTemplates() {
    for (const template of templates) {
        log.info(`${template.name}: \n\n\t${template.description}\n\t${template.repository}`);
    }
}
