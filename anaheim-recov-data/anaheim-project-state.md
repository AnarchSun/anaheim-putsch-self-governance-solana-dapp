import fs from 'fs' import path from 'path' import { fileURLToPath } from 'url'

const **filename = fileURLToPath(import.meta.url) const **dirname = path.dirname(\_\_filename)

const MEMORY_FILE = path.join(\_\_dirname, 'anaheim-project-state.md')

const content = fs.readFileSync(MEMORY_FILE, 'utf8') console.log(content)
