import { cancel, log, note, outro } from '@clack/prompts';
import * as process from 'node:process';
import { createApp } from './utils/create-app';
import { finalNote } from './utils/final-note';
import { getAppInfo } from './utils/get-app-info';
import { getArgs as getArguments } from './utils/get-args';
import { detectInvokedPackageManager } from './utils/vendor/package-manager';
export async function main(argv) {
    // Get the invoked package manager
    const pm = detectInvokedPackageManager();
    // Get app info from package.json
    const app = getAppInfo();
    try {
        // Get the result from the command line and prompts
        const arguments_ = await getArguments(argv, app, pm);
        if (arguments_.dryRun) {
            note(JSON.stringify(arguments_, undefined, 2), 'Arguments');
            outro('🚀 Dry run was used, no changes were made');
            return;
        }
        if (arguments_.verbose) {
            log.warn(`Verbose output enabled`);
            console.warn(arguments_);
        }
        // Create the app
        const instructions = await createApp(arguments_);
        note(finalNote({ ...arguments_, target: arguments_.targetDirectory.replace(process.cwd(), '.'), instructions }), 'Installation successful');
        outro('Good luck with your project!');
    }
    catch (error) {
        cancel(`${error}`);
        process.exit(1);
    }
}
