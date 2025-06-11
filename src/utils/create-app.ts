import { createAppTaskCloneTemplate } from './create-app-task-clone-template'
import { createAppTaskInitializeGit } from './create-app-task-initialize-git'
import { createAppTaskInstallDependencies } from './create-app-task-install-dependencies'
import { createAppTaskRunInitScript } from './create-app-task-run-init-script'
import { GetArgsResult } from './get-args-result'
import { tasks } from './vendor/clack-tasks'

export async function createApp(args: GetArgsResult) {
  return tasks([
    () => createAppTaskCloneTemplate(args),
    () => createAppTaskInstallDependencies(args),
    () => createAppTaskRunInitScript(args),
    () => createAppTaskInitializeGit(args),
  ])
}
