import * as semver from 'semver'
import { getVersionAnchor, getVersionAvm, getVersionRust, getVersionSolana } from './get-version'
export function validateVersion({ required, version }) {
  const valid = semver.satisfies(version ?? '', `>=${required}`)
  return {
    required,
    valid,
    version,
  }
}
export function validateAnchorVersion(required) {
  return validateVersion({ required, version: getVersionAnchor() })
}
export function validateSolanaVersion(required) {
  return validateVersion({ required, version: getVersionSolana() })
}
export function listVersions() {
  const anchor = getVersionAnchor()
  const avm = getVersionAvm()
  const rust = getVersionRust()
  const solana = getVersionSolana()
  console.log(`Locally installed versions:`)
  console.log(`  Anchor: ${anchor}`)
  console.log(`  AVM   : ${avm}`)
  console.log(`  Rust  : ${rust}`)
  console.log(`  Solana: ${solana}`)
}
