// utils/find-dead-code.ts
import fs from 'fs'
import glob from 'fast-glob'

async function findDeadComponents() {
  const files = await glob(['src/**/*.{ts,tsx}'], {
    ignore: ['**/*.test.*', '**/__tests__/**', '**/*.d.ts'],
  })

  const exportsMap: Record<string, string[]> = {} // file => [exported functions]
  const allContent = files.map((file) => ({
    path: file,
    content: fs.readFileSync(file, 'utf8'),
  }))

  // Step 1: Collect all named component exports
  for (const { path: file, content } of allContent) {
    const matches = [...content.matchAll(/export function (\w+)/g)]
    if (matches.length > 0) {
      exportsMap[file] = matches.map((m) => m[1])
    }
  }

  // Step 2: Check all files for usage of those exports
  const usedExports = new Set<string>()
  for (const { content } of allContent) {
    for (const fn of Object.values(exportsMap).flat()) {
      const usageRegex = new RegExp(`\\b${fn}\\b`, 'g')
      if (usageRegex.test(content)) {
        usedExports.add(fn)
      }
    }
  }

  // Step 3: Report unused exports
  console.log(`\n🔍 Dead Component Scan Report`)
  console.log(`==============================`)

  let deadFound = false
  for (const [file, exports] of Object.entries(exportsMap)) {
    const unused = exports.filter((fn) => !usedExports.has(fn))
    if (unused.length > 0) {
      deadFound = true
      console.log(`\n📁 ${file}`)
      for (const fn of unused) {
        console.log(`   ⚠️  Possibly unused export: '${fn}'`)
      }
    }
  }

  if (!deadFound) {
    console.log(`✅ No unused exported components detected.`)
  }

  console.log(`\nDone.`)
}

findDeadComponents().catch(console.error)
