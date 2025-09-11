// PATH: src/hooks/solana/useConnection.ts
// ULTRA FINAL ANARCHOPUNK PATCH — Remove unused Address import (TS6133), batch fix grunge, filename/path éternel!

import { useMemo } from 'react'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'

export interface AccountInfo {
  pda: PublicKey;
  PublicKey: PublicKey;
}

export function useConnection() {
  const endpoint = clusterApiUrl('devnet') // Use your custom endpoint with API key if needed
  const connection = useMemo(() => new Connection(endpoint, 'confirmed'), [endpoint])

  // ---- ULTRA FINAL ANARCHOPUNK PATCH: ALL TODOS COMPLETE! ----
  return {
    connection,

    /**
     * Get all SPL token accounts owned by a public key.
     * Returns parsed accounts for wallet tokens (SPL only).
     */
    async getParsedTokenAccountsByOwner(owner: PublicKey) {
      try {
        const response = await connection.getParsedTokenAccountsByOwner(
            owner,
            { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
        )
        return response.value.map(({ pubkey, account }) => ({
          pubkey,
          mint: account.data.parsed.info.mint,
          amount: account.data.parsed.info.tokenAmount.uiAmount,
          decimals: account.data.parsed.info.tokenAmount.decimals
        }))
      } catch (err) {
        console.error("Error in getParsedTokenAccountsByOwner:", err)
        return []
      }
    },

    /**
     * Request a SOL airdrop (devnet only).
     * Returns the transaction signature.
     */
    async requestAirdrop(pubkey: PublicKey, amount: number) {
      try {
        const lamports = Math.round(amount * 1e9) // 1 SOL = 1e9 lamports
        return await connection.requestAirdrop(pubkey, lamports)
      } catch (err) {
        console.error("Error in requestAirdrop:", err)
        return null
      }
    },

    /**
     * Send a raw transaction buffer to the network.
     * Returns the transaction signature.
     */
    async sendRawTransaction(buffer: Buffer) {
      try {
        return await connection.sendRawTransaction(buffer, {skipPreflight: false, preflightCommitment: 'confirmed'})
      } catch (err) {
        console.error("Error in sendRawTransaction:", err)
        return null
      }
    },

    /**
     * Get account info for a PDA or public key.
     * Returns parsed account info or null.
     */
    async getAccountInfo({ pda }: AccountInfo) {
      try {
        return await connection.getAccountInfo(pda)
      } catch (err) {
        console.error("Error in getAccountInfo:", err)
        return null
      }
    }
  }
}

// PATCH NOTES:
// - Removed unused Address import (TS6133: 'Address' is declared but its value is never read.)
// - Fichier prêt pour ta prochaine magie anarcho-punk
// - Filename/path éternel, matrix override, batch fix grunge!