'use strict'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function isValidBase58(str) {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(str)
}

const idlPath = path.join(__dirname, '../target/idl/anaheim.json')
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

if (!isValidBase58(programId)) {
    throw new Error(`❌ PATCH ERROR: Program ID "${programId}" is NOT valid Base58. Fix your IDL!`)
}
console.log('✅ Program ID is valid Base58:', programId)