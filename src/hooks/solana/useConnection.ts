// Path: src/hooks/solana/useConnection.ts
import { useMemo } from 'react'
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js'
import {UiWalletAccount} from "@wallet-ui/react";

export interface AccountInfo {
  pda: PublicKey;
  PublicKey: PublicKey;
}

export function useConnection(s: string, confirmed: SolanaClient<string>, signer: unknown) {
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
        const txSig = await connection.requestAirdrop(pubkey, lamports)
        return txSig
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
        const txSig = await connection.sendRawTransaction(buffer, { skipPreflight: false, preflightCommitment: 'confirmed' })
        return txSig
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
        const info = await connection.getAccountInfo(pda)
        return info
      } catch (err) {
        console.error("Error in getAccountInfo:", err)
        return null
      }
    }
  }
}