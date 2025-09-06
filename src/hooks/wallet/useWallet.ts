// Path: src/hooks/solana/useConnection.ts
import { useMemo } from 'react'
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js'

interface AccountInfo {
  pda: PublicKey;
  PublicKey: any;
}

export function useConnection() {
  const endpoint = clusterApiUrl('devnet') // or use your custom endpoint with API key if needed
  const connection = useMemo(() => new Connection(endpoint, 'confirmed'), [endpoint])
  return {
    connection,
    // Example: Add your real logic for these methods
    getParsedTokenAccountsByOwner() {
      // TODO: Implement as needed or remove stub
      return Promise.resolve(undefined)
    },
    requestAirdrop(pubkey: PublicKey, amount: number) {
      // TODO: Implement or remove stub
      return Promise.resolve(undefined)
    },
    sendRawTransaction(buffer: Buffer) {
      // TODO: Implement or remove stub
      return Promise.resolve(undefined)
    },
    getAccountInfo({ pda, PublicKey }: AccountInfo) {
      // TODO: Implement or remove stub
      return Promise.resolve(undefined)
    }
  }
}