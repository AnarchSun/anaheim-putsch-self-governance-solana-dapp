// PATH: src/app/api/accountApi.ts
// ULTRA FINAL ANARCHOPUNK PATCH — Batch fix: Remove unused function getStakeAccountInfo
// Lyric punk, matrix override, forbidden mirror, always batch fix, always add path and filename

import {Connection, PublicKey, SendTransactionError} from '@solana/web3.js';
import {connection} from "@/utils/solanaConnection";

const SOLANA_RPC_URL =
    process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || 'https://api.devnet.solana.com';
const PROGRAM_ID =
    process.env.NEXT_PUBLIC_PROGRAM_ID || '83hJCMp2PeJYgUhHBRmhEbt2ofvzKayvebT9YAU8rURB';

/**
 * Get Anaheim PDA account info for a wallet public key.
 */
export async function getAccountInfo(pubkey: string) {
    const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
    try {
        const [anaheimPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("anaheim"), new PublicKey(pubkey).toBuffer()],
            new PublicKey(PROGRAM_ID)
        );
        return await connection.getAccountInfo(anaheimPDA); // null if not found
    } catch (err) {
        console.error('getAccountInfo error:', err);
        return null;
    }
}

/**
 * Initialize Anaheim account for a wallet public key.
 * This is a placeholder — replace with Anchor/IDL transaction logic to call 'initialize'.
 */
export async function initializeAccount() {
    // PATCH: Remove unused _pubkey argument to fix @typescript-eslint/no-unused-vars
    // TODO: Replace this stub with real Anchor/IDL logic!
    try {
        // ... ton code d'invocation d'anchor ici ...
    } catch (err) {
        if (err instanceof SendTransactionError) {
            console.error('Simulation failed:', err.message);
            console.log('Logs:', await err.getLogs(connection));
        } else {
            console.error('Init error:', err);
        }
        throw err;
    }
}

// PATCH NOTES:
// - Function getStakeAccountInfo removed as unused
// - All other logic preserved
// - Filename/path toujours!