import { parseVersion } from './parse-version'
export function getVersion(command, regex) {
  try {
    return parseVersion(command, regex)
  } catch {
    return undefined
  }
}
export function getVersionAnchor() {
  return getVersion('anchor --version', /anchor-cli (\d+\.\d+\.\d+)/)
}
export function getVersionSolana() {
  return getVersion('solana --version', /solana-cli (\d+\.\d+\.\d+)/)
}
export function getVersionRust() {
  return getVersion('rustc --version', /rustc (\d+\.\d+\.\d+)/)
}
export function getVersionAvm() {
  return getVersion('avm --version', /avm (\d+\.\d+\.\d+)/)
}
