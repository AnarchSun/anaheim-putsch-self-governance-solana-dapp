import { log } from '@clack/prompts'
import { join } from 'node:path'
import { bold, yellow } from 'picocolors'
import { ensureTargetPath } from './ensure-target-path'
import { deleteInitScript, getInitScript } from './get-init-script'
import { searchAndReplace } from './search-and-replace'
import { validateAnchorVersion, validateSolanaVersion } from './validate-version'
import { taskFail } from './vendor/clack-tasks'
import { namesValues } from './vendor/names'
export function createAppTaskRunInitScript(arguments_) {
  return {
    enabled: !arguments_.skipInit,
    title: 'Running init script',
    task: async (result) => {
      try {
        const init = getInitScript(arguments_.targetDirectory)
        if (!init) {
          return result({ message: 'Repository does not have an init script' })
        }
        if (arguments_.verbose) {
          log.warn(`Running init script`)
        }
        await initCheckVersion(init)
        if (arguments_.verbose) {
          log.warn(`initCheckVersion done`)
        }
        await initRename(arguments_, init, arguments_.verbose)
        if (arguments_.verbose) {
          log.warn(`initRename done`)
        }
        const instructions = (initInstructions(init) ?? [])
          ?.filter(Boolean)
          .map((message) => message.replace('{pm}', arguments_.packageManager))
        if (arguments_.verbose) {
          log.warn(`initInstructions done`)
        }
        deleteInitScript(arguments_.targetDirectory)
        if (arguments_.verbose) {
          log.warn(`deleteInitScript done`)
        }
        return result({ message: 'Executed init script', instructions })
      } catch (error) {
        taskFail(`init: Error running init script: ${error}`)
      }
    },
  }
}
async function initRename(arguments_, init, verbose) {
  // Rename template to project name throughout the whole project
  await searchAndReplace(
    arguments_.targetDirectory,
    [`template-${arguments_.template.name}`, arguments_.template.name],
    [arguments_.name, arguments_.name],
    false,
    verbose,
  )
  // Return early if there are no renames defined in the init script
  if (!init?.rename) {
    return
  }
  // Loop through each word in the rename object
  for (const from of Object.keys(init.rename)) {
    // Get the 'to' property from the rename object
    const to = init.rename[from].to.replace('{{name}}', arguments_.name.replace(/-/g, ''))
    // Get the name matrix for the 'from' and the 'to' value
    const fromNames = namesValues(from)
    const toNames = namesValues(to)
    for (const path of init.rename[from].paths) {
      const targetPath = join(arguments_.targetDirectory, path)
      if (!(await ensureTargetPath(targetPath))) {
        console.error(`init-script.rename: target does not exist ${targetPath}`)
        continue
      }
      await searchAndReplace(join(arguments_.targetDirectory, path), fromNames, toNames, arguments_.dryRun)
    }
  }
}
async function initCheckVersion(init) {
  if (init?.versions?.anchor) {
    await initCheckVersionAnchor(init.versions.anchor)
  }
  if (init?.versions?.solana) {
    await initCheckVersionSolana(init.versions.solana)
  }
}
async function initCheckVersionAnchor(requiredVersion) {
  try {
    const { required, valid, version } = validateAnchorVersion(requiredVersion)
    if (!version) {
      log.warn(
        [
          bold(yellow(`Could not find Anchor version. Please install Anchor.`)),
          'https://www.anchor-lang.com/docs/installation',
        ].join(' '),
      )
    } else if (!valid) {
      log.warn(
        [
          yellow(`Found Anchor version ${version}. Expected Anchor version ${required}.`),
          'https://www.anchor-lang.com/release-notes/0.30.1',
        ].join(' '),
      )
    }
  } catch (error_) {
    log.warn(`Error ${error_}`)
  }
}
async function initCheckVersionSolana(requiredVersion) {
  try {
    const { required, valid, version } = validateSolanaVersion(requiredVersion)
    if (!version) {
      log.warn(
        [
          bold(yellow(`Could not find Solana version. Please install Solana.`)),
          'https://docs.solana.com/cli/install-solana-cli-tools',
        ].join(' '),
      )
    } else if (!valid) {
      log.warn(
        [
          yellow(`Found Solana version ${version}. Expected Solana version ${required}.`),
          'https://docs.solana.com/cli/install-solana-cli-tools',
        ].join(' '),
      )
    }
  } catch (error_) {
    log.warn(`Error ${error_}`)
  }
}
function initInstructions(init) {
  return init?.instructions?.length === 0 ? [] : init?.instructions
}
