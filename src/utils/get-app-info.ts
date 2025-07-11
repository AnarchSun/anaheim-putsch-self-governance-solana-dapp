import packageJson from '../../../../anarcrypt.sol/anaheim-putsch-self-governance-solana-dapp/package.json' assert { type: 'json' }

export interface AppInfo {
  name: string
  version: string
}

export function getAppInfo(): AppInfo {
  return {
    name: packageJson.name,
    version: packageJson.version,
  }
}
