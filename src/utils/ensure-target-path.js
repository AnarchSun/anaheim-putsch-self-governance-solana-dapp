import { access } from 'node:fs/promises'
export async function ensureTargetPath(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}
