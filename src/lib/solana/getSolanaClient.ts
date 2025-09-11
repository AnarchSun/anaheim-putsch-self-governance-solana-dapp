// PATH: src/lib/solana/solanaClient.ts
// ULTRA FINAL ANARCHOPUNK PATCH: Always import RPC_URL from config, no hardcode, batch fix grunge, filename/path éternel!

import { Connection, PublicKey, Commitment, AccountChangeCallback, GetBlockHeightConfig } from '@solana/web3.js'
import { getStakeActivation } from '@anza-xyz/solana-rpc-get-stake-activation'
import { SOLANA_CLUSTER_URL } from '@/config/solana' // Punk override: get endpoint from config!

export function getSolanaClient() {
  // Always use endpoint from config—no more hand edits!
  const connection = new Connection(SOLANA_CLUSTER_URL, 'confirmed')

  return {
    getStakeActivation: async (pubkey: PublicKey) => {
      return await getStakeActivation(connection, pubkey)
    },

    getStakeMinimumDelegation: () => Promise.resolve(1000000),

    getVoteAccounts: () => connection.getVoteAccounts(),

    getBlockHeight: (commitment?: Commitment | GetBlockHeightConfig) => connection.getBlockHeight(commitment),

    onAccountChange: (publicKey: PublicKey, callback: AccountChangeCallback, commitment?: Commitment): number => {
      const config = commitment ? { commitment } : undefined
      return connection.onAccountChange(publicKey, callback, config)
    },

    removeAccountChangeListener: (id: number) => connection.removeAccountChangeListener(id),
  }
}

// PATCH NOTES:
// - Endpoint always imported from @/config/solana (SOLANA_CLUSTER_URL) for reality override.
// - No manual URL edits!
// - Batch fix grunge, filename/path éternel!