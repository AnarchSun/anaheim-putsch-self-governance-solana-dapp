'use strict'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const idlPath = path.join(__dirname, '../target/idl/anaheim.json')
const outPath = path.join(__dirname, '../src/config/solana.ts')

// Crée le dossier si absent
const outDir = path.dirname(outPath)
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
}

let idl
try {
    idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'))
} catch (e) {
    throw new Error(`IDL file not found or invalid: ${idlPath}\n${e}`)
}

const programId =
    idl.metadata?.address ||
    idl.address ||
    idl.programId ||
    idl.metadata?.programId

if (!programId) throw new Error('Program ID not found in IDL!')

const content = `// Ce fichier est généré à chaque build/deploy! Ne pas modifier à la main!
export const PROGRAM_ID = "${programId}"; // PATCH: auto-updated
`

fs.writeFileSync(outPath, content)
console.log('✅ PROGRAM_ID updated:', programId)