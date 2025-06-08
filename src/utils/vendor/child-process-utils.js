/**
 * This file includes portions of code from the 'create-nx-workspace' package.
 * The original code can be found at:
 * https://github.com/nrwl/nx/blob/2c0a50c0d8f45f65c9a91e1426fc2e66a29af3bb/packages/create-nx-workspace/src/utils/child-process-utils.ts
 *
 * This code is licensed under the MIT License:
 * MIT License
 * Copyright (c) 2017-2024 Narwhal Technologies Inc.
 *
 * The full MIT License is available in the LICENSE file at the root of this repository.
 */
import { exec } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
export class CreateAppError extends Error {
    logMessage;
    code;
    logFile;
    constructor(logMessage, code, logFile) {
        super(logMessage);
        this.logMessage = logMessage;
        this.code = code;
        this.logFile = logFile;
        this.name = 'CreateAppError';
    }
}
export function execAndWait(command, cwd) {
    return new Promise((res, rej) => {
        exec(command, { cwd, env: { ...process.env } }, (error, stdout, stderr) => {
            if (error) {
                const errorString = stderr && stderr.trim().length > 0 ? stderr : `${error}`;
                const logFile = join(cwd, 'error.log');
                writeFileSync(logFile, `${stdout}\n${errorString}`);
                const message = errorString.trim().length > 0 ? errorString : `An error occurred while running ${command}`;
                rej(new CreateAppError(message, error.code, logFile));
            }
            else {
                res({ code: 0, stdout });
            }
        });
    });
}
