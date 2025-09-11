// PATH: scripts/update-program-id.js
// ULTRA FINAL ANARCHOPUNK PATCH — Batch fix TS2451, matrix override, progid auto-sync!

'use strict'

// PATCH: Only require ONCE, at the top, matrix override!
import fs from 'fs'
import path from 'path'

// Chemin vers ton idl généré par anchor
const idlPath = path.join(__dirname, '../anchor/target/idl/anaheim.json')
const outPath = path.join(__dirname, '../constants/programId.ts')

// PATCH: Read IDL and extract programId safely
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

// PATCH NOTES:
// - No redeclaration TS2451 (fs/path)
// - All requires at the top, always batch fix
// - Error handling for missing/invalid IDL
// - Filename/path toujours, matrix override!