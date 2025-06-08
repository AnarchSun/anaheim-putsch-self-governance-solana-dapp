import { log } from '@clack/prompts';
import { taskFail } from './vendor/clack-tasks';
import { initializeGitRepo } from './vendor/git';
export function createAppTaskInitializeGit(arguments_) {
    return {
        enabled: !arguments_.skipGit,
        title: 'Initializing git',
        task: async (result) => {
            try {
                if (arguments_.verbose) {
                    log.warn(`Initializing git repo`);
                }
                await initializeGitRepo(arguments_.targetDirectory, {
                    commit: { email: '', name: '', message: 'chore: initial commit' },
                });
                return result({ message: 'Initialized git repo' });
            }
            catch (error) {
                if (arguments_.verbose) {
                    log.error(`Error initializing git repo: ${error}`);
                    console.error(error);
                }
                log.error(`${error}`);
                taskFail(`init: Error initializing git: ${error}`);
            }
        },
    };
}
