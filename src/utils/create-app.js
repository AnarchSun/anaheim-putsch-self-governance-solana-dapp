import { createAppTaskCloneTemplate } from './create-app-task-clone-template';
import { createAppTaskInitializeGit } from './create-app-task-initialize-git';
import { createAppTaskInstallDependencies } from './create-app-task-install-dependencies';
import { createAppTaskRunInitScript } from './create-app-task-run-init-script';
import { tasks } from './vendor/clack-tasks';
export async function createApp(arguments_) {
    return tasks([
        // Clone the template to the target directory
        createAppTaskCloneTemplate(arguments_),
        // Install the dependencies
        createAppTaskInstallDependencies(arguments_),
        // Run the init script define in package.json .init property
        createAppTaskRunInitScript(arguments_),
        // Initialize git repository
        createAppTaskInitializeGit(arguments_),
    ]);
}
