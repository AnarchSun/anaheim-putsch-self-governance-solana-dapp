import packageJson from '../../package.json' assert { type: 'json' }
export function getAppInfo() {
  return {
    name: packageJson.name,
    version: packageJson.version,
  }
}
