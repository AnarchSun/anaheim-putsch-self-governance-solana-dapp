// Path: src/hooks/solana/useConnection.ts
import {useMemo} from 'react'
import {
    clusterApiUrl,
    Commitment,
    Connection,
    LAMPORTS_PER_SOL,
    ParsedAccountData,
    PublicKey,
    TransactionConfirmationStrategy
} from '@solana/web3.js'

import React from "react";

// Next.js expects the default export in layout.tsx to be a React component
export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="account-layout">
            {/* Optional: Add account-specific header/sidebar here */}
            {children}
        </div>
    );
}
interface AccountInfo {
    pda: PublicKey;
    PublicKey?: PublicKey;
}

class TransactionConfirmationConfig {
}

export function useConnection() {
    const endpoint = clusterApiUrl('devnet') // or use your custom endpoint with API key if needed
    const connection = useMemo(() => new Connection(endpoint, 'confirmed'), [endpoint])

    // Helper: use new confirmTransaction signature
    async function confirmTxWithNewApi(signature: string, commitment: Commitment = 'confirmed') {
        const config: TransactionConfirmationConfig = { signature }
        // The new API signature
        return await connection.confirmTransaction(config as TransactionConfirmationStrategy, commitment);
    }

    return {
        connection,

        // Retrieve all parsed token accounts for a given owner (wallet address)
        async getParsedTokenAccountsByOwner(owner: PublicKey) {
            try {
                const accounts = await connection.getParsedTokenAccountsByOwner(owner, { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") });
                // Returns array of token account info
                return accounts.value.map(acc => ({
                    pubkey: acc.pubkey,
                    parsed: acc.account.data as ParsedAccountData,
                }));
            } catch (e) {
                console.error("Error fetching token accounts:", e)
                return []
            }
        },

        // Request an airdrop of SOL
        async requestAirdrop(pubkey: PublicKey, amount: number) {
            try {
                const signature = await connection.requestAirdrop(pubkey, amount * LAMPORTS_PER_SOL);
                // Wait for confirmation - use new API
                await confirmTxWithNewApi(signature, 'confirmed');
                return signature
            } catch (e) {
                console.error("Error requesting airdrop:", e)
                return null
            }
        },

        // Send a raw transaction
        async sendRawTransaction(buffer: Buffer) {
            try {
                const signature = await connection.sendRawTransaction(buffer);
                // Wait for confirmation - use new API
                await confirmTxWithNewApi(signature, 'confirmed');
                return signature
            } catch (e) {
                console.error("Error sending raw transaction:", e)
                return null
            }
        },

        // Fetch account info for a PDA or PublicKey
        async getAccountInfo({ pda, PublicKey: pubkey }: AccountInfo) {
            try {
                const key = pubkey ?? pda;
                return await connection.getAccountInfo(key)
            } catch (e) {
                console.error("Error fetching account info:", e)
                return null
            }
        },
    }
}