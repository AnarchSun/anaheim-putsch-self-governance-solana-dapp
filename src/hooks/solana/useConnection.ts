// hooks/useConnection.ts
// src/hooks/solana/useConnection.ts
import { useMemo } from 'react'
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js'

interface AccountInfo {
  pda: PublicKey;
  PublicKey: any;
}

export function useConnection() {
  const endpoint = clusterApiUrl('devnet') // ou un endpoint custom
  const connection = useMemo(() => new Connection(endpoint, 'confirmed'), [endpoint])
  return { connection,
    getParsedTokenAccountsByOwner() {
      //  TODO ORION..
    },
    requestAirdrop(pubkey: PublicKey, number: number) {
        return Promise.resolve ( undefined )
    },
    sendRawTransaction(buffer: Buffer) {
      return Promise.resolve ( undefined )
    },
      getAccountInfo({pda, PublicKey}: AccountInfo) {
          return Promise.resolve(undefined);
      }
  }
}
