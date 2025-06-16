/**
 * Vendor in the clack tasks code until it's released to npm
 * Read more here: https://github.com/bombshell-dev/clack/issues/181
 *
 * This code is licensed under the MIT License:
 * MIT License
 * Copyright (c) Nate Moore
 *
 * The full MIT License is available in the LICENSE file at the root of this repository.
 */
import { log, spinner } from '@clack/prompts'
/**
 * Define a group of tasks to be executed
 */
export async function tasks(tasks) {
  const instructions = []
  for (const task of tasks) {
    if (task.enabled === false) continue
    const s = spinner()
    s.start(task.title)
    const result = await task.task((value) => {
      return value
    })
    s.stop(result?.message ?? task.title)
    if (result?.instructions) {
      instructions.push(...result.instructions)
    }
  }
  return instructions
}
export function taskFail(message) {
  log.error(message)
  throw new Error(message)
}
