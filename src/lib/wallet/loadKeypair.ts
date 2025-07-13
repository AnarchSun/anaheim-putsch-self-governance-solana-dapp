// File: src/lib/wallet/loadKeypair.ts
import fs from 'fs'
import path from 'path'
import { Keypair } from '@solana/web3.js'

/**
 * Load a Solana Keypair from `wallet/id.json`.
 * Returns null if the file is missing or invalid.
 */
export function loadKeypair(): Keypair | null {
    const idPath = path.resolve('wallet/id.json')

    if (!fs.existsSync(idPath)) {
        console.warn('⚠️ wallet/id.json not found. Skipping keypair loading.')
        return null
    }

    try {
        const raw = fs.readFileSync(idPath, 'utf-8')
        const secret = JSON.parse(raw)

        if (!Array.isArray(secret) || secret.length !== 64) {
            throw new Error('Invalid secret key format')
        }

        return Keypair.fromSecretKey(Uint8Array.from(secret))
    } catch (err) {
        console.error('❌ Failed to load wallet/id.json:', err)
        return null
    }
}
