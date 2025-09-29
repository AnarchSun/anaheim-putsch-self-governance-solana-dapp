// FILE: scripts/update-program-id.ts
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import TOML from '@iarna/toml'
import { fileURLToPath } from 'url'
import { Keypair, PublicKey } from "@solana/web3.js";

import os from 'os';

const walletPath = path.join(os.homedir(), '.config', 'solana', 'id.json');

const walletKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(walletPath, 'utf-8')))
);

export const WALLET_PUBKEY = walletKeypair.publicKey;

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envPath = path.join(__dirname, '..', '.env.local')
dotenv.config({ path: envPath })

let programId: string = process.env.NEXT_PUBLIC_PROGRAM_ID || ''

if (!programId) {
    console.log('⚠️ NEXT_PUBLIC_PROGRAM_ID absent, lecture Anchor.toml…')

    const anchorTomlPath = path.join(__dirname, '..', 'anchor', 'Anchor.toml')
    if (!fs.existsSync(anchorTomlPath)) {
        throw new Error(`Anchor.toml introuvable : ${anchorTomlPath}`)
    }

    const anchorTomlContent = fs.readFileSync(anchorTomlPath, 'utf8')

    // ✅ Typage explicite

// Déclare la structure attendue
    interface AnchorToml {
        programs?: {
            devnet?: { anaheim?: string }
            localnet?: { anaheim?: string }
        }
    }

// …dans ton code
    const parsed = TOML.parse(anchorTomlContent) as unknown as AnchorToml

    programId =
        parsed.programs?.devnet?.anaheim ??
        parsed.programs?.localnet?.anaheim ??
        ''


    if (!programId) {
        throw new Error(
            'Program ID introuvable dans Anchor.toml et .env.local'
        )
    }
    console.log(`✅ Program ID trouvé : ${programId}`)
}

// --- Mise à jour src/config/solana.ts ---
const configPath = path.join(__dirname, '..', 'src', 'config', 'solana.ts')
const configSrc = fs.readFileSync(configPath, 'utf8')
const configPatched = configSrc.replace(
    /programId:\s*['"].+['"]/,
    `programId: '${programId}'`
)
fs.writeFileSync(configPath, configPatched)
console.log(`✅ src/config/solana.ts mis à jour → ${programId}`)

// --- Mise à jour .env.local ---
let envText = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : ''
envText = envText.includes('NEXT_PUBLIC_PROGRAM_ID')
    ? envText.replace(/NEXT_PUBLIC_PROGRAM_ID=.*/, `NEXT_PUBLIC_PROGRAM_ID=${programId}`)
    : `${envText}\nNEXT_PUBLIC_PROGRAM_ID=${programId}\n`
fs.writeFileSync(envPath, envText)
console.log(`✅ .env.local mis à jour → ${programId}`)
