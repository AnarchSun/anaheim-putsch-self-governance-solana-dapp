import { execSync } from 'child_process'

try {
  execSync('pnpm install --yes', { stdio: 'inherit' })
} catch (e) {
  console.warn("Trying force fallback")
  execSync('pnpm install --no-frozen-lockfile --force', { stdio: 'inherit' })
}
